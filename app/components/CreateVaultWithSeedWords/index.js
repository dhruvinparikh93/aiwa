import React, { Component } from 'react';
import { connect } from 'react-redux';

// Import Other Libraries
import Animated from 'animated/lib/targets/react-dom';
import classNames from 'classnames';

// Import Components
import Footer from '../Common/Footer';
import FontError from '../Common/Fonts/FontError';
import ButtonLink from '../Common/Buttons/ButtonLink';
import ButtonLG from '../Common/Buttons/ButtonLG';

// Import Validation Object and rules
import AiwaValidator from '../../utils/AiwaValidator';
import validator from '../../utils/AiwaValidator/validator';

// // Import Actions
import { changePageStatus, updateToken } from '../../constants/common';
import { updateWalletList, seedWordsUpdate, changeCurrentWallet } from '../../constants/wallets';
import { createVault } from '../../services/vaultService';
import { updateTransactionList } from '../../constants/transactions';
import { sendMessage } from '../../services/browserService';

// Import Constants
import { IMPORT_VAULT_PAGE, HOME_PAGE } from '../../constants/navigation';

// Import Styles
import './styles.css';

class CreateVaultWithSeedWords extends Component {
  constructor(props) {
    super(props);

    // Declare Validator as well as Wallet variables
    this.validator = new AiwaValidator(validator.importSeedPhraseValidation);

    this.setSeedWordsInputRef = element => {
      this.textInput = element;
    };

    this.state = {
      seedWords: '',
      invalidSeedPhrases: [],
      keyCode: undefined,
      previousKey: '',
      pastedData: false,
      seedWordsHTML: '',
      submitted: false,
      footerHeight: new Animated.Value(0),
    };
  }

  componentDidMount() {
    Animated.spring(this.state.footerHeight, { toValue: 69 }).start();
  }

  componentWillUnmount() {
    Animated.spring(this.state.footerHeight, { toValue: -30 }).start();
  }

  handleClick = async () => {
    const { seedWords } = this.state;

    this.setState({ submitted: true });

    // Validate Everytime User Enters
    const validation = this.validator.validate({ ...this.state, submitted: true });

    if (!validation.isValid) {
      return;
    }

    const getKey = await sendMessage({ result: 'getKey' });
    const hashKey = getKey.data;
    const data = await createVault(hashKey, seedWords);
    this.props.updateWalletList(data.wallets);
    this.props.changeCurrentWallet(data.currentWallet);
    this.props.updateTransactionList(undefined);
    this.props.updateToken(hashKey);
    this.props.seedWordsUpdate(data.seedWords);
    this.props.changePageStatus(HOME_PAGE);
  };

  importVault = () => {
    this.props.changePageStatus('importvault');
  };

  handleOnPaste = event => {
    // Get Pasted Data
    const value = event.clipboardData.getData('Text');

    // Set State
    this.setState({ seedWords: value, pastedData: true }, () => {
      this.handleOnKeyDown({
        keyCode: 32,
        key: 'pastedData',
        pastedData: true,
      });
    });
  };

  handleOnKeyDown = event => {
    // Declare Variables
    const { keyCode, pastedData, key } = event;
    this.setState({ previousKey: key });

    // Check if text is selected
    const { selectionEnd, selectionStart } = this.textInput;

    let { seedWords } = this.state;
    if (key === 'Backspace') {
      // Delete Selected Text
      if (selectionEnd !== selectionStart) {
        seedWords = seedWords.replace(seedWords.substring(selectionStart, selectionEnd), '');
      } else {
        seedWords = seedWords.slice(0, -1);
      }
    } else if (key === 'Enter') {
      seedWords += '\n';
    } else if (
      this.state.previousKey !== 'Control'
      && this.state.previousKey !== 'Alt'
      && key.length === 1
    ) {
      seedWords += key;
    }

    this.setState({ seedWords, keyCode }, () => {
      let invalidSeedPhrases = [];

      // User Pressed Space, delete or enter
      if (keyCode === 32 || keyCode === 8 || keyCode === 13 || pastedData) {
        let highlightedHTML = '';

        // Validate Everytime User finishes typing word
        const validation = this.validator.validate(this.state);
        ({ invalidSeedPhrases } = validation.invalidSeedPhrases);

        if (invalidSeedPhrases.length > 0) {
          // Replace new lines with 'aiwaspace'
          const currentSeedPhrase = this.state.seedWords
            .trim()
            .replace(/\n/g, ' aiwaspace')
            .split(' ');

          if (currentSeedPhrase[0] !== '') {
            currentSeedPhrase.forEach((seedPhrase, index) => {
              let newLineHTML = '';

              // Check if user added newline
              if (seedPhrase.search(/^aiwaspace*/g) === 0) {
                newLineHTML = '<br/>';
                seedPhrase = seedPhrase.replace(/^aiwaspace*/gi, '');
              }

              if (invalidSeedPhrases.indexOf(seedPhrase) !== -1) {
                highlightedHTML = `${highlightedHTML}${
                  index !== 0 ? ' ' : ''
                }${newLineHTML}<mark class="incorrect-phrase">${seedPhrase}</mark>`;
              } else {
                highlightedHTML = `${highlightedHTML}${
                  index !== 0 ? ' ' : ''
                }${newLineHTML}${seedPhrase}`;
              }
            });
          }
        }

        this.setState({ seedWordsHTML: highlightedHTML });
      }
    });
  };

  render() {
    const { footerHeight, seedWordsHTML } = this.state;

    // Validate Everytime User Enters
    const validation = this.validator.validate(this.state);

    const textAreaClassName = classNames({
      'create-vault-seed-words-textarea': true,
      'create-vault-seed-words-textarea-error': !validation.isValid,
    });

    return (
      <div>
        <div className="create-vault-seed-container">
          <div className="create-vault-seed-words-title">
            <p>Insert your seed words</p>
          </div>

          <div className="create-vault-seed-words-message">
            Input your seed words below, seperated by spaces. Your seed words will be used to
            generated wallets.
          </div>

          <div className="create-vault-seed-words-phrases">
            <textarea
              className={textAreaClassName}
              placeholder="Enter seed words here..."
              name="seedWords"
              ref={this.setSeedWordsInputRef}
              onKeyPress={this.handleOnKeyPress}
              onKeyDown={this.handleOnKeyDown}
              onPaste={this.handleOnPaste}
              style={{
                resize: 'none',
              }}
            />
            <div
              dangerouslySetInnerHTML={{ __html: seedWordsHTML }}
              className="create-vault-seed-words-editable-div"
            />
            <FontError>
              {validation.seedWords.message || validation.invalidSeedPhrases.message}
            </FontError>
          </div>

          <div className="create-vault-seed-words-submit-button">
            <ButtonLG color="secondary" onClick={this.handleClick} disabled={!validation.isValid}>
              Create Vault
            </ButtonLG>
          </div>
        </div>

        <Footer style={{ height: footerHeight }}>
          <div className="create-vault-seed-footer-content">
            <p>Already have a vault?</p>
            <ButtonLink
              onClick={() => {
                this.props.changePageStatus(IMPORT_VAULT_PAGE);
              }}
            >
              Import a vault
            </ButtonLink>
          </div>
        </Footer>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  changePageStatus: newPage => dispatch(changePageStatus(newPage)),
  changeCurrentWallet: wallet => dispatch(changeCurrentWallet(wallet)),
  updateWalletList: wallets => dispatch(updateWalletList(wallets)),
  updateTransactionList: transactions => dispatch(updateTransactionList(transactions)),
  updateToken: token => dispatch(updateToken(token)),
  seedWordsUpdate: seedWords => dispatch(seedWordsUpdate(seedWords)),
});

export default connect(
  null,
  mapDispatchToProps,
)(CreateVaultWithSeedWords);
