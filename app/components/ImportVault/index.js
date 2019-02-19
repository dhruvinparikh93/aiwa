import React, { Component } from 'react';
import { connect } from 'react-redux';

// Import Libraries
import Animated from 'animated/lib/targets/react-dom';
import classNames from 'classnames';

// Import Components
import { faKey } from '@fortawesome/free-solid-svg-icons';
import { IconImportVault } from '../Common/Icon';
import IconInput from '../Common/Inputs/IconInput';
import FontRegular from '../Common/Fonts/FontRegular';
import FontMedium from '../Common/Fonts/FontMedium';
import FontError from '../Common/Fonts/FontError';
import ButtonXS from '../Common/Buttons/ButtonXS';

// Import Actions and Services
import { importVault } from '../../actions/vault';
import { INVALID_FILE_STRINGS } from '../../constants/vaults';
import { changePageStatus } from '../../constants/common';
import { getCurrentWalletBalance } from '../../actions/wallet';
import { updateTransactionList } from '../../constants/transactions';
import { createToast } from '../../constants/toast';
import { readFile } from '../../services/importExportService';
import { initializeWallet, loadWallet } from '../../actions/home';

import {
  IMPORT_VAULT_HEIGHT,
  IMPORT_VAULT_ITEM,
  settingsItemAnimatedMap,
  settingsItemHighlightMap,
} from '../../constants/animation';

import {
  shrinkSettingItems,
  animateSettingItemIn,
  animateSettingItemOut,
  unhighlightSettingItems,
  highlightSettingItems,
} from '../../services/animationService';

// Import Styles
import './styles.css';

// Declare Animated Value Variable
const importVaultInputHeight = settingsItemAnimatedMap.get(IMPORT_VAULT_ITEM);

const mapStateToProps = state => ({
  pageStatus: state.appState.pageStatus,
  token: state.appState.token,
  toastOptions: state.toast.toastOptions,
  showSettings: state.animationReducer.showSettings,
  currentNetwork: state.networks.currentNetwork,
  currentWallet: state.wallets.currentWallet,
});

class ImportVault extends Component {
  constructor(props) {
    super(props);

    // Declare Input Ref
    this.importVaultHiddenRef = React.createRef();

    this.state = {
      importVaultFile: undefined,
      importVaultInput: '',
      importVaultInputError: false,
      importVaultFileName: '',
      disableImport: false,
      timeoutID: undefined,
      highlightContainer: false,
    };
  }

  static getDerivedStateFromProps(props) {
    if (props.showSettings === false) {
      Animated.timing(importVaultInputHeight, {
        toValue: 0,
      }).start();
    }

    return null;
  }

  handleOnChange = event => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  triggerFileExplorer = () => {
    if (this.state.timeoutID) return;

    if (this.state.disableImport) {
      this.props.createToast({
        message:
          "Well aren't you cheeky trying to import. I'll lift the ban in a couple of seconds",
        type: 'warning',
      });

      const timeoutID = setTimeout(() => {
        this.setState({ disableImport: false, timeoutID: undefined }, () => {
          this.props.createToast({
            message: "I'm feeling generous now. You can give importing another shot. 😊",
            type: 'success',
          });
        });
      }, 6000);

      this.setState({ timeoutID });

      return;
    }

    // Set State
    this.setState({
      importVaultInput: '',
      importVaultInputError: false,
      importVaultFileName: '',
    });

    // Unhighlight Item
    unhighlightSettingItems(IMPORT_VAULT_ITEM);
    this.handleContainerMouseEnter();

    // Shrink other items
    shrinkSettingItems(IMPORT_VAULT_ITEM);

    // Animate Input In
    animateSettingItemIn(importVaultInputHeight, IMPORT_VAULT_HEIGHT, () => {});

    // Simulate Click to bring up file browser
    this.importVaultHiddenRef.current.click();
  };

  trimFileName = fileName => {
    if (fileName.length > 80) {
      return `${fileName.slice(0, 30)}...${fileName.substr(fileName.length - 20)}`;
    }
    return fileName;
  };

  handleImportVault = async event => {
    // If Browser Has File Reader
    if (window.FileReader) {
      // Grab Selected File and save to state
      const file = event.target.files[0];
      const fileData = await readFile(file, true);
      this.setState({
        importVaultFile: fileData.result,
        importVaultFileName: fileData.name,
      });
    }
  };

  handleImport = () => {
    const { importVaultInput, importVaultFile } = this.state;
    this.validateImportFile(importVaultInput, importVaultFile, this.props.token);
  };

  validateImportFile = async (password, file, token) => {
    try {
      const data = await this.props.importVault(file, password, token);

      if (data && Object.keys(data).length > 0 && data.message === undefined) {
        await this.props.loadWallet();
        this.props.createToast({
          message: 'Vault successfully imported',
          type: 'success',
        });

        this.props.updateTransactionList(undefined);
      } else {
        const { counter, ...otherData } = data;
        if (counter === INVALID_FILE_STRINGS.length - 1) {
          this.setState({ disableImport: true });
        }
        this.props.createToast(otherData);
      }

      highlightSettingItems();
      animateSettingItemOut(importVaultInputHeight, () => {
        this.props.initializeWallet();
      });
    } catch (error) {
      // console.log(error);
      this.props.createToast({
        message: 'This may not be an AIWA vault. Or it may be the wrong password.',
        type: 'error',
      });
      this.setState({ importVaultInputError: true });
    }
  };

  handleContainerMouseEnter = () => {
    let highlightContainer = true;

    if (settingsItemHighlightMap.get(IMPORT_VAULT_ITEM)) {
      highlightContainer = false;
    }

    this.setState({
      highlightContainer,
    });
  };

  handleContainerMouseLeave = () => {
    this.setState({ highlightContainer: false });
  };

  render() {
    const {
      importVaultInput,
      importVaultFileName,
      importVaultInputError,
      highlightContainer,
    } = this.state;

    const fileNameClassName = classNames({
      'settings-import-vault-file-name-text': true,
      'settings-import-vault-file-name-long-text': importVaultFileName.length > 100,
    });

    const containerClassName = classNames({
      [this.props.className]: true,
      [`${this.props.className}-highlighted`]: highlightContainer,
    });

    return (
      <div
        className={containerClassName}
        onMouseEnter={this.handleContainerMouseEnter}
        onMouseLeave={this.handleContainerMouseLeave}
      >
        <div className="settings-import-vault-label" onClick={this.triggerFileExplorer}>
          <IconImportVault className="settings-icon" />
          <FontRegular className="settings-title">Import Vault</FontRegular>
          <input
            type="file"
            style={{ display: 'none' }}
            ref={this.importVaultHiddenRef}
            onChange={this.handleImportVault}
          />
        </div>

        <Animated.div
          className="settings-import-vault-content"
          style={{
            height: importVaultInputHeight,
            overflow: 'hidden',
          }}
        >
          <div className="settings-import-vault-file-name">
            <FontMedium className={fileNameClassName}>
              File:
              {' '}
              <span>
                {' '}
                {this.trimFileName(importVaultFileName)}
              </span>
            </FontMedium>
          </div>
          <div className="settings-import-vault-input">
            <IconInput
              icon={faKey}
              type="password"
              name="importVaultInput"
              value={importVaultInput}
              onChange={this.handleOnChange}
              placeholder="Enter Password"
              error={importVaultInputError}
            />
            {importVaultInputError ? (
              <FontError style={{ color: '#FF0000' }}>Invalid Password</FontError>
            ) : null}
          </div>

          <div className="settings-import-vault-button">
            <ButtonXS onClick={this.handleImport}>Import</ButtonXS>
          </div>

          <div className="settings-import-padding" />
        </Animated.div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  changePageStatus: newPage => dispatch(changePageStatus(newPage)),
  updateTransactionList: transactions => dispatch(updateTransactionList(transactions)),
  getCurrentWalletBalance: () => dispatch(getCurrentWalletBalance()),
  createToast: toastOptions => dispatch(createToast(toastOptions)),
  importVault: (input, password, token) => dispatch(importVault(input, password, token)),
  initializeWallet: () => dispatch(initializeWallet()),
  loadWallet: () => dispatch(loadWallet()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ImportVault);
