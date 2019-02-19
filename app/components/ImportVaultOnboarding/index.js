import React, { Component } from 'react';
import { connect } from 'react-redux';

// Import Libraries
import Animated from 'animated/lib/targets/react-dom';
import classNames from 'classnames';

// Import Components
import Input from '../Common/Inputs/Input';
import Footer from '../Common/Footer';
import FontMedium from '../Common/Fonts/FontMedium';
import FontError from '../Common/Fonts/FontError';
import { IconFile, IconFileUpload } from '../Common/Icon';

// Import Styles
import './styles.css';
import ButtonLink from '../Common/Buttons/ButtonLink';
import ButtonLG from '../Common/Buttons/ButtonLG';

// Import Actions and Services
import { importVault } from '../../actions/vault';
import { INVALID_FILE_STRINGS } from '../../constants/vaults';
import { changePageStatus } from '../../constants/common';
import { HOME_PAGE, CREATE_VAULT_PAGE } from '../../constants/navigation';
import { updateTransactionList } from '../../constants/transactions';
import { createToast } from '../../constants/toast';
import { readFile, trimFileName } from '../../services/importExportService';

// Import Validation Object and rules
import AiwaValidator from '../../utils/AiwaValidator';
import validator from '../../utils/AiwaValidator/validator';
import { loadWallet } from '../../actions/home';

const mapStateToProps = state => ({
  pageStatus: state.appState.pageStatus,
  token: state.appState.token,
  toastOptions: state.toast.toastOptions,
  showSettings: state.animationReducer.showSettings,
  currentNetwork: state.networks.currentNetwork,
  currentWallet: state.wallets.currentWallet,
});

class ImportVaultOnboarding extends Component {
  constructor(props) {
    super(props);

    // Declare Validator as well as Wallet variables
    this.validator = new AiwaValidator(validator.importVaultOnboarding);

    // Declare Input Ref
    this.importVaultOnboardingHiddenRef = React.createRef();

    this.state = {
      importVaultOnboardingFile: undefined,
      importVaultOnboardingPassword: '',
      importVaultOnboardingInputError: false,
      importVaultOnboardingFileName: '',
      validation: undefined,
      importVaultOnboardingInputErrorMessage:
        'This may not be an AIWA vault. Or it may be the wrong password.',
      footerHeight: new Animated.Value(0),
    };
  }

  componentDidMount() {
    Animated.spring(this.state.footerHeight, { toValue: 69 }).start();
    this.triggerFileExplorer();
  }

  componentWillUnmount() {
    Animated.spring(this.state.footerHeight, { toValue: -30 }).start();
  }

  handleOnChange = event => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  triggerFileExplorer = () => {
    // Simulate Click to bring up file browser
    this.importVaultOnboardingHiddenRef.current.click();
  };

  handleFileUpload = async event => {
    // If Browser Has File Reader
    if (window.FileReader) {
      // Grab Selected File and save to state

      const file = event.target.files[0];
      const fileData = await readFile(file, true);
      this.setState({
        importVaultOnboardingFile: fileData.result,
        importVaultOnboardingFileName: fileData.name,
      });
    }
  };

  handleImportVault = async () => {
    // Return if Validation is incorrect
    const validation = this.validator.validate(this.state);
    this.setState({ validation });
    if (!validation.isValid) return;
    try {
      const data = await this.props.importVault(
        this.state.importVaultOnboardingFile,
        this.state.importVaultOnboardingPassword,
        this.props.token,
      );

      if (data && Object.keys(data).length > 0 && data.message === undefined) {
        this.props.updateTransactionList(undefined);
        await this.props.loadWallet();
        this.props.createToast({
          message: 'Vault successfully imported',
          type: 'success',
        });
      } else {
        const { counter, ...otherData } = data;
        if (counter === INVALID_FILE_STRINGS.length - 1) {
          this.setState({ disableImport: true });
        }
        this.props.createToast(otherData);
      }
      this.props.changePageStatus(HOME_PAGE);
    } catch (error) {
      this.props.createToast({
        message: this.state.importVaultOnboardingInputErrorMessage,
        type: 'error',
      });
      this.setState({ importVaultOnboardingInputError: true });
    }
  };

  render() {
    const {
      props: { changePageStatus },
      state: {
        importVaultOnboardingPassword,
        importVaultOnboardingFileName,
        importVaultOnboardingInputError,
        footerHeight,
        importVaultOnboardingInputErrorMessage,
        validation,
      },
    } = this;
    const fileNameClassName = classNames({
      'import-vault-onboarding-file-name-text': true,
      'import-vault-onboarding-file-name-long-text': importVaultOnboardingFileName.length > 100,
    });
    return (
      <div>
        <div className="import-vault-onboarding-container">
          <div className="import-vault-onboarding-title">
            <p>Import your vault</p>
          </div>
          <div className="import-vault-onboarding-file-name" onClick={this.triggerFileExplorer}>
            <FontMedium className={fileNameClassName}>
              {importVaultOnboardingFileName.length > 0 ? (
                <IconFile />
              ) : (
                <div>
                  <IconFileUpload />
                  Choose vault
                </div>
              )}
              <span>{trimFileName(importVaultOnboardingFileName)}</span>
            </FontMedium>

            <input
              type="file"
              style={{ display: 'none' }}
              ref={this.importVaultOnboardingHiddenRef}
              onChange={this.handleFileUpload}
            />
            <FontError>
              {validation === undefined ? ' ' : validation.importVaultOnboardingFileName.message}
            </FontError>
          </div>
          <div className="import-vault-onboarding-password">
            <Input
              type="password"
              name="importVaultOnboardingPassword"
              value={importVaultOnboardingPassword}
              onChange={this.handleOnChange}
              placeholder="Enter Password"
              error={importVaultOnboardingInputError}
            />
            {importVaultOnboardingInputError ? (
              <FontError style={{ color: '#FF0000' }}>
                {importVaultOnboardingInputErrorMessage}
              </FontError>
            ) : null}
            <FontError>
              {validation === undefined ? ' ' : validation.importVaultOnboardingPassword.message}
            </FontError>
          </div>
          <div className="import-vault-onboarding-submit-button">
            <ButtonLG color="secondary" onClick={this.handleImportVault}>
              Import Vault
            </ButtonLG>
          </div>
        </div>
        <Footer style={{ height: footerHeight }}>
          <div className="create-vault-footer-content">
            <p>Don`t have a vault yet?</p>

            <ButtonLink
              onClick={() => {
                changePageStatus(CREATE_VAULT_PAGE);
              }}
            >
              Create a new vault
            </ButtonLink>
          </div>
        </Footer>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  changePageStatus: newPage => dispatch(changePageStatus(newPage)),
  updateTransactionList: transactions => dispatch(updateTransactionList(transactions)),
  createToast: toastOptions => dispatch(createToast(toastOptions)),
  importVault: (input, password, token) => dispatch(importVault(input, password, token)),
  loadWallet: () => dispatch(loadWallet()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ImportVaultOnboarding);
