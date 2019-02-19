import React, { Component } from 'react';
import { connect } from 'react-redux';

// Import Libraries
import Animated from 'animated/lib/targets/react-dom';
import classNames from 'classnames';

// Import Components
import { faCircle as faCircleSolid } from '@fortawesome/free-solid-svg-icons';
import { faCircle } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import FontError from '../Common/Fonts/FontError';
import ButtonXS from '../Common/Buttons/ButtonXS';
import { IconImportVault } from '../Common/Icon';
import FontRegular from '../Common/Fonts/FontRegular';

// Import Actions and Services
import { changePageStatus } from '../../constants/common';
import { createToast } from '../../constants/toast';
import { updateWalletList, changeCurrentWallet } from '../../constants/wallets';
import { initializeWallet } from '../../actions/home';
import { importWallet } from '../../services/walletService';
import { readFile } from '../../services/importExportService';
import toggleApplicationAnimationOff from '../../actions/animation';
import {
  walletSettingsItemAnimatedMap,
  applicationSettingsAnimatedMap,
  WALLET_SETTINGS,
  IMPORT_WALLET_ITEM,
  IMPORT_WALLET_PRIVATE_KEY_HEIGHT,
  IMPORT_WALLET_KEYSTORE_HEIGHT,
} from '../../constants/animation';
import {
  animateWalletSettingItemIn,
  animateWalletSettingItemOut,
  shrinkWalletSettingItems,
} from '../../services/animationService';
import { getLocalStorage, setLocalStorage } from '../../services/browserService';
import { changeSelectedToken } from '../../constants/tokens';
import config from '../../app.config';

// Import Validation Object and rules
import AiwaValidator from '../../utils/AiwaValidator';
import validator from '../../utils/AiwaValidator/validator';

import './styles.css';

// Declare Animated Value Variable
const importWalletAnimatedHeight = walletSettingsItemAnimatedMap.get(IMPORT_WALLET_ITEM);
const walletSettingsAnimatedHeight = applicationSettingsAnimatedMap.get(WALLET_SETTINGS);

const mapStateToProps = state => ({
  showWalletSettings: state.animationReducer.showWalletSettings,
  wallets: state.wallets.wallets,
  tokenList: state.tokens.tokenList,
  currentNetwork: state.networks.currentNetwork,
  token: state.appState.token,
});

class ImportWallet extends Component {
  constructor(props) {
    super(props);

    // Declare Validator as well as Wallet variables
    this.validator = new AiwaValidator(validator.importWalletDropdown);

    // Declare Input Ref
    this.importWalletHiddenRef = React.createRef();

    this.state = {
      inputAnimatedHeight: new Animated.Value(0),
      filenameContainerAnimatedHeight: new Animated.Value(0),
      selectedOption: 1,
      keystorePassword: '',
      privateKeyInput: '',
      keystoreFileName: '',
      keystoreFile: undefined,
      showPrivateKeyInput: true,
      submitted: false,
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (state.selectedOption) {
      const toValue = state.selectedOption === 1 ? 84 : 45;
      Animated.spring(state.inputAnimatedHeight, {
        toValue,
      }).start();

      Animated.spring(state.filenameContainerAnimatedHeight, {
        toValue: state.selectedOption === 1 ? 0 : 20,
      }).start();
    }

    if (props.showWalletSettings === false) {
      Animated.timing(importWalletAnimatedHeight, {
        toValue: 0,
      }).start();
    }

    return null;
  }

  triggerFileExplorer = () => {
    // Set State
    this.setState({
      keystorePassword: '',
      keystorePasswordError: false,
      keystoreFileName: '',
    });

    // Shrink Other items
    shrinkWalletSettingItems(IMPORT_WALLET_ITEM);

    // Animate Input In
    animateWalletSettingItemIn(importWalletAnimatedHeight, IMPORT_WALLET_PRIVATE_KEY_HEIGHT);
  };

  handleFileBrowserClick = async event => {
    // If Browser Has File Reader
    if (window.FileReader) {
      // Grab Selected File and save to state
      const file = event.target.files[0];
      const fileData = await readFile(file, false);
      this.setState({
        keystoreFile: fileData.result,
        keystoreFileName: this.trimFileName(fileData.name),
      });
    }
  };

  handleOptionSelection = event => {
    const selectedOption = Number(event.target.getAttribute('option'));

    if (selectedOption === 1) {
      animateWalletSettingItemIn(importWalletAnimatedHeight, IMPORT_WALLET_PRIVATE_KEY_HEIGHT);
    }

    if (selectedOption === 2) {
      // Simulate Click to bring up file browser
      this.importWalletHiddenRef.current.click();
      animateWalletSettingItemIn(importWalletAnimatedHeight, IMPORT_WALLET_KEYSTORE_HEIGHT);
    }
    this.setState({ selectedOption });
  };

  handleInputOnChange = event => {
    const { value, name } = event.target;

    this.setState({
      [name]: value,
    });
  };

  handleImportWallet = async () => {
    // Declare Variables
    const { selectedOption } = this.state;

    this.setState({ submitted: true });

    try {
      let newVault;

      if (selectedOption === 2) {
        newVault = await importWallet(
          'keystoreFile',
          this.state.keystoreFile,
          this.props.token,
          this.props.wallets,
          this.state.keystorePassword,
        );
      } else {
        const validation = this.validator.validate({
          ...this.state,
          submitted: true,
        });

        if (!validation.isValid) {
          return;
        }
        newVault = await importWallet(
          'privateKey',
          this.state.privateKeyInput,
          this.props.token,
          this.props.wallets,
        );
      }

      if (newVault !== undefined) {
        // Turn off all other animations within Reducer State
        this.props.toggleApplicationAnimationOff();

        Animated.timing(walletSettingsAnimatedHeight, {
          toValue: 0,
          duration: 200,
        }).start(async () => {
          animateWalletSettingItemOut(importWalletAnimatedHeight);
          this.props.updateWalletList(newVault.wallets);
          this.props.changeCurrentWallet(newVault.currentWallet);
          // Get Transaction Object
          const transactionsLocalStorageObj = await getLocalStorage('transactions');
          const transactions = JSON.parse(transactionsLocalStorageObj.transactions);

          // Declare Empty Transactions Array for new Wallet
          transactions[newVault.currentWallet.address] = [];

          // Store Transactions
          setLocalStorage('transactions', JSON.stringify(transactions));
          await this.props.initializeWallet();
          const initialSelectedToken = this.props.tokenList[newVault.currentWallet.address][
            this.props.currentNetwork.value
          ][config.aionCoinIndex];
          this.props.changeSelectedToken(initialSelectedToken);
        });

        this.props.createToast(
          {
            message: 'Wallet was successfully imported.',
            type: 'success',
          },
          true,
          true,
        );

        this.setState({ submitted: false });
      } else {
        this.props.createToast(
          {
            message: 'Wallet already exists.',
            type: 'warning',
          },
          true,
          true,
        );

        this.setState({ submitted: false });
      }
    } catch (error) {
      this.props.createToast(
        {
          message: 'Error. Please try again.',
          type: 'error',
        },
        true,
        true,
      );
      this.setState({ submitted: false });
      throw error;
    }
  };

  trimFileName = fileName => {
    if (fileName.length > 50) {
      return `${fileName.slice(0, 20)}...${fileName.substr(fileName.length - 10)}`;
    }
    return fileName;
  };

  render() {
    const {
      inputAnimatedHeight,
      filenameContainerAnimatedHeight,
      selectedOption,
      keystorePassword,
      privateKeyInput,
      keystoreFileName,
    } = this.state;

    // Validate Everytime User Enters
    const validation = this.validator.validate(this.state);

    // Declare ClassNames
    const containerClassName = classNames({
      [this.props.className]: true,
      [`${this.props.className}-highlighted`]: false,
    });
    const importWalletContentClassName = classNames({
      'account-settings-import-wallet-content': true,
      'account-settings-import-wallet-content-privatekey-padding': selectedOption === 1,
    });

    const animatedInputClassName = classNames({
      'account-settings-import-wallet-animated-input': true,
      'account-settings-import-wallet-animated-input-error':
        selectedOption === 1
          ? validation.privateKeyInput.isInvalid
          : validation.keystoreFileName.isInvalid || validation.keystorePassword.isInvalid,
    });

    return (
      <div className={containerClassName}>
        <div className="account-settings-import-wallet-label" onClick={this.triggerFileExplorer}>
          <IconImportVault className="account-settings-icon" />
          <FontRegular className="account-settings-title">Import Wallet</FontRegular>
          <input
            type="file"
            style={{ display: 'none' }}
            ref={this.importWalletHiddenRef}
            onChange={this.handleFileBrowserClick}
          />
        </div>

        <Animated.div
          className={importWalletContentClassName}
          style={{
            height: importWalletAnimatedHeight,
            overflow: 'hidden',
          }}
        >
          <div className="account-settings-import-wallet-option">
            <span className="account-settings-import-wallet-option-label">Options</span>
            <div
              className="account-settings-import-wallet-option-1"
              onClick={this.handleOptionSelection}
              option={1}
            >
              <FontAwesomeIcon
                icon={selectedOption === 1 ? faCircleSolid : faCircle}
                style={{
                  fontSize: 10,
                  color: '#47849e',
                  marginLeft: 5,
                  marginRight: 5,
                }}
                option={1}
              />
              Private Key
            </div>
            <div
              className="account-settings-import-wallet-option-2"
              onClick={this.handleOptionSelection}
              option={2}
            >
              <FontAwesomeIcon
                icon={selectedOption === 2 ? faCircleSolid : faCircle}
                style={{
                  fontSize: 10,
                  color: '#47849e',
                  marginLeft: 5,
                  marginRight: 5,
                }}
                option={2}
              />
              Keystore
            </div>
          </div>

          <Animated.div
            className="account-settings-import-wallet-filename"
            style={{
              height: filenameContainerAnimatedHeight,
            }}
          >
            <React.Fragment>
              <span className="account-settings-import-wallet-filename-label">
                File:
                {' '}
                <span className="account-settings-import-wallet-filename-value">
                  {this.trimFileName(keystoreFileName)}
                </span>
              </span>
            </React.Fragment>
          </Animated.div>

          <Animated.div
            className={animatedInputClassName}
            style={{
              height: inputAnimatedHeight,
            }}
          >
            {selectedOption === 1 ? (
              <React.Fragment>
                <textarea
                  className="account-settings-import-wallet-hidden-textarea"
                  placeholder="Enter your private key here..."
                  onChange={this.handleInputOnChange}
                  value={privateKeyInput}
                  name="privateKeyInput"
                />
                {validation.privateKeyInput.isInvalid ? (
                  <FontError style={{ color: '#FF0000', marginTop: 3 }}>
                    {validation.privateKeyInput.message}
                  </FontError>
                ) : (
                  <span />
                )}
              </React.Fragment>
            ) : (
              <React.Fragment>
                <input
                  className="account-settings-import-wallet-hidden-input"
                  placeholder="Enter the password here..."
                  type="password"
                  value={keystorePassword}
                  name="keystorePassword"
                  onChange={this.handleInputOnChange}
                />

                {validation.keystorePassword.isInvalid || validation.keystoreFileName.isInvalid ? (
                  <FontError style={{ color: '#FF0000', marginTop: 3 }}>
                    {validation.keystorePassword.message || validation.keystoreFileName.message}
                  </FontError>
                ) : (
                  <span />
                )}
              </React.Fragment>
            )}
          </Animated.div>
          <div className="account-settings-import-wallet-button">
            <ButtonXS onClick={this.handleImportWallet}>Import</ButtonXS>
          </div>

          <div className="account-settings-import-padding" />
        </Animated.div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  changePageStatus: newPage => dispatch(changePageStatus(newPage)),
  changeCurrentWallet: wallet => dispatch(changeCurrentWallet(wallet)),
  updateWalletList: wallets => dispatch(updateWalletList(wallets)),
  changeSelectedToken: selectedToken => dispatch(changeSelectedToken(selectedToken)),
  createToast: (toastOptions, hideProgressBar, autoclose) => dispatch(createToast(toastOptions, hideProgressBar, autoclose)),
  initializeWallet: () => dispatch(initializeWallet()),
  toggleApplicationAnimationOff: () => dispatch(toggleApplicationAnimationOff()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ImportWallet);
