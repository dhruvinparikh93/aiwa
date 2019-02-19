import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// Import Other Libraries
import { keccak512 } from 'js-sha3';
import zxcvbn from 'zxcvbn';
import Animated from 'animated/lib/targets/react-dom';

// Import Components
import Input from '../Common/Inputs/Input';
import Footer from '../Common/Footer';
import FontError from '../Common/Fonts/FontError';
import ButtonLink from '../Common/Buttons/ButtonLink';
import ButtonLG from '../Common/Buttons/ButtonLG';

// // Import Actions
import { changePageStatus, updateToken } from '../../constants/common';
import { updateWalletList, seedWordsUpdate, changeCurrentWallet } from '../../constants/wallets';
import { createVault, storeHashKeyToHandleSeedWords } from '../../services/vaultService';
import { updateTransactionList } from '../../constants/transactions';

// Import Navigation
import {
  SEED_WORDS_ONBOARDING,
  IMPORT_VAULT_PAGE,
  CREATE_VAULT_SEED_WORDS,
} from '../../constants/navigation';

// Import Styles
import './styles.css';

/* eslint-disable-next-line */
const mapStateToProps = state => ({});

const strength = {
  0: 'Why even bother...',
  1: 'At least you tried.',
  2: "I suppose that'll work.",
  3: "Now we're talking!",
  4: "You've mastered life.",
};

class CreateVault extends Component {
  static defaultProps = {
    changePageStatusFunc: undefined,
    updateWalletListFunc: undefined,
    changeCurrentWalletFunc: undefined,
    updateTransactionListFunc: undefined,
    updateTokenFunc: undefined,
    seedWordsUpdate: undefined,
  };

  static propTypes = {
    changePageStatusFunc: PropTypes.func,
    updateWalletListFunc: PropTypes.func,
    changeCurrentWalletFunc: PropTypes.func,
    updateTransactionListFunc: PropTypes.func,
    updateTokenFunc: PropTypes.func,
    seedWordsUpdate: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      password: undefined,
      confirmPassword: undefined,
      score: 0,
      passwordError: false,
      passwordErrorText: undefined,
      match: false,
      matchErrorText: undefined,
      footerHeight: new Animated.Value(0),
      cpwdTouched: false,
      withSeedWords: false,
    };
  }

  componentDidMount() {
    Animated.spring(this.state.footerHeight, { toValue: 69 }).start();
  }

  componentWillUnmount() {
    Animated.spring(this.state.footerHeight, { toValue: -30 }).start();
  }

  handleClick = () => {
    const {
      state: { password, confirmPassword },
      props: {
        updateWalletListFunc,
        changeCurrentWalletFunc,
        updateTransactionListFunc,
        updateTokenFunc,
        changePageStatusFunc,
        seedWordsUpdate,
      },
    } = this;

    let { passwordError, passwordErrorText } = this.state;

    if (password === undefined || !this.validateUserInput(password)) {
      passwordError = true;
      passwordErrorText = 'Password must be 8 characters or more.';

      this.setState({ passwordError, passwordErrorText });
      return;
    }

    if (confirmPassword !== password) {
      this.setState({
        match: password === confirmPassword,
        matchErrorText: confirmPassword === password ? '' : 'Passwords do not match',
      });
      return;
    }

    const hashKey = keccak512(password);

    createVault(hashKey).then(data => {
      updateWalletListFunc(data.wallets);
      changeCurrentWalletFunc(data.currentWallet);
      updateTransactionListFunc(undefined);
      updateTokenFunc(hashKey);
      seedWordsUpdate(data.seedWords);
      changePageStatusFunc(SEED_WORDS_ONBOARDING); // KP: Change to Reveal Seed words
    });
  };

  handleSeedWordsClick = async () => {
    const {
      state: { password, confirmPassword },
      props: { changePageStatusFunc },
    } = this;

    let { passwordError, passwordErrorText } = this.state;

    if (password === undefined || !this.validateUserInput(password)) {
      passwordError = true;
      passwordErrorText = 'Password must be 8 characters or more.';

      this.setState({ passwordError, passwordErrorText });
      return;
    }

    if (confirmPassword !== password) {
      this.setState({
        match: password === confirmPassword,
        matchErrorText: confirmPassword === password ? '' : 'Passwords do not match',
      });
      return;
    }
    await storeHashKeyToHandleSeedWords(password);
    changePageStatusFunc(CREATE_VAULT_SEED_WORDS);
  };

  handleOnChange = e => {
    const { name, value } = e.target;
    const {
      state: {
        confirmPassword, password, match, cpwdTouched
      },
    } = this;
    let { score } = this.state;
    if (name === 'password') {
      const result = zxcvbn(value);
      ({ score } = result);
    }

    if (!match && cpwdTouched) {
      if (name !== 'password' && value !== '') {
        if (value !== undefined && password !== undefined) {
          this.setState({
            match: password === value,
            matchErrorText: value === password ? '' : 'Passwords do not match',
          });
        }
      } else if (value !== undefined && confirmPassword !== '' && confirmPassword !== undefined) {
        this.setState({
          match: confirmPassword === value,
          matchErrorText: value === confirmPassword ? '' : 'Passwords do not match',
        });
      }
    }

    this.setState(
      {
        [name]: value,
      },
      () => {
        this.setState({
          score,
        });
      },
    );
  };

  handleOnBlur = e => {
    const { name, value } = e.target;
    let { score } = this.state;
    const {
      state: { confirmPassword, password },
    } = this;

    if (name === 'password') {
      const result = zxcvbn(value);
      ({ score } = result);
    }

    this.setState(
      {
        [name]: value,
      },
      () => {
        this.setState({
          score,
        });
      },
    );

    if (name === 'password') {
      if (!this.validateUserInput(value)) {
        this.setState({
          passwordError: true,
          passwordErrorText: 'Password must be 8 characters or more.',
        });
      } else {
        this.setState({ passwordError: false, passwordErrorText: '' });
      }
    }

    if (name !== 'password') {
      if (value !== undefined && password !== undefined) {
        this.setState({
          match: password === value,
          matchErrorText: value === password ? '' : 'Passwords do not match',
        });
      }
      this.setState({ cpwdTouched: true });
    } else if (value !== undefined && confirmPassword !== undefined) {
      this.setState({
        match: confirmPassword === value,
        matchErrorText: value === confirmPassword ? '' : 'Passwords do not match',
      });
    }
  };

  handleSeedChange = e => {
    const { checked } = e.target;
    this.setState({
      withSeedWords: checked,
    });
  };

  importVault = () => {
    const {
      props: { changePageStatusFunc },
    } = this;
    changePageStatusFunc('importvault');
  };

  validateUserInput = input => input.length >= 8;

  render() {
    const {
      footerHeight,
      password,
      confirmPassword,
      passwordError,
      passwordErrorText,
      match,
      matchErrorText,
      score,
      withSeedWords,
    } = this.state;

    return (
      <div>
        <div className="create-vault-container">
          <div className="create-vault-title">
            <p>Create a password for your vault</p>
          </div>

          <div className="create-vault-password">
            <Input
              placeholder="Password"
              type="password"
              name="password"
              value={password}
              onBlur={this.handleOnBlur}
              onChange={this.handleOnChange}
              error={passwordError && passwordErrorText}
            />
            <FontError>{passwordError ? passwordErrorText : ' '}</FontError>
          </div>

          <div className="create-vault-confirm-password">
            <Input
              placeholder="Confirm Password"
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onBlur={this.handleOnBlur}
              onChange={this.handleOnChange}
              error={!match && matchErrorText}
            />
            <FontError>{match ? ' ' : matchErrorText}</FontError>
          </div>

          <div className="create-vault-password-meter">
            <meter max="4" value={score} min="0" />
            <p className="meter-caption">
              Password Strength:
              {' '}
              <b>{strength[score]}</b>
            </p>
          </div>

          <div className="create-vault-seed">
            <p>
              <input type="checkbox" onChange={this.handleSeedChange} />
              {' '}
Use existing seed words
            </p>
          </div>
          <div className="create-vault-submit-button">
            {withSeedWords ? (
              <ButtonLG color="secondary" onClick={this.handleSeedWordsClick}>
                Next
              </ButtonLG>
            ) : (
              <ButtonLG color="secondary" onClick={this.handleClick}>
                Create Vault
              </ButtonLG>
            )}
          </div>
        </div>

        <Footer style={{ height: footerHeight }}>
          <div className="create-vault-footer-content">
            <p>Already have a vault?</p>

            <ButtonLink
              onClick={() => {
                this.props.changePageStatusFunc(IMPORT_VAULT_PAGE);
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
  changePageStatusFunc: newPage => dispatch(changePageStatus(newPage)),
  changeCurrentWalletFunc: wallet => dispatch(changeCurrentWallet(wallet)),
  updateWalletListFunc: wallets => dispatch(updateWalletList(wallets)),
  updateTransactionListFunc: transactions => dispatch(updateTransactionList(transactions)),
  updateTokenFunc: token => dispatch(updateToken(token)),
  seedWordsUpdate: seedWords => dispatch(seedWordsUpdate(seedWords)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CreateVault);
