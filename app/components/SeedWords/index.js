import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// Import Components
import { CopyToClipboard } from 'react-copy-to-clipboard';
import AiwaMultilineInput from '../Common/AiwaMultilineInput';
import Footer from '../Common/Footer';

// // Import Actions
import { changePageStatus } from '../../constants/common';
import { loadWallet } from '../../actions/home';

// Import Constants
import { HOME_PAGE } from '../../constants/navigation';

// Import Styles
import './styles.css';
import ButtonMD from '../Common/Buttons/ButtonMD';
import ButtonLG from '../Common/Buttons/ButtonLG';
import { expCreateExportElement } from '../../services/importExportService';

const mapStateToProps = state => ({
  seedWords: state.wallets.seedWords,
});

class SeedWords extends Component {
  static defaultProps = {
    seedWords: undefined,
    changePageStatusFunc: undefined,
  };

  static propTypes = {
    changePageStatusFunc: PropTypes.func,
    seedWords: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    //Animated.spring(this.state.footerHeight, { toValue: 69 }).start();
  }

  componentWillUnmount() {
    //Animated.spring(this.state.footerHeight, { toValue: -30 }).start();
  }

  importVault = () => {
    const {
      props: { changePageStatusFunc },
    } = this;
    changePageStatusFunc('importvault');
  };

  downloadCSV = () => {
    const element = expCreateExportElement(document, this.props.seedWords, 'aiwa-seeds.txt');
    element.click();
  };

  handleOnClick = async () => {
    await this.props.loadWallet();
    this.props.changePageStatusFunc(HOME_PAGE);
  };

  validateUserInput = input => input.length >= 8;

  render() {
    return (
      <div>
        <div className="seed-words-container">
          <div className="seed-words-title">Secure Seed Phrase</div>
          <div className="seed-words-message">
            In addition to exporting your vault, you can recover your AIWA-generated wallets with
            this seed phrase. Save this somewhere safe and don’t share it.
          </div>
          <div className="seed-words-textarea">
            <AiwaMultilineInput height="100px" width="316.34px">
              {this.props.seedWords}
            </AiwaMultilineInput>
          </div>

          <div className="seed-words-clipboard-button">
            <CopyToClipboard text={this.props.seedWords}>
              <ButtonMD color="primary" onClick={this.handleClick} disabled={false}>
                Copy to Clipboard
              </ButtonMD>
            </CopyToClipboard>
          </div>
          <div className="seed-words-continue-button" />
        </div>
        <Footer style={{ height: 69 }}>
          <div className="create-vault-footer-content">
            <ButtonLG color="secondary" onClick={this.handleOnClick} disabled={false}>
              Continue
            </ButtonLG>
          </div>
        </Footer>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  changePageStatusFunc: newPage => dispatch(changePageStatus(newPage)),
  loadWallet: () => dispatch(loadWallet()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SeedWords);
