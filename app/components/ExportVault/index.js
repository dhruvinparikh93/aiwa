import React, { Component } from 'react';
import { connect } from 'react-redux';

// Import Libraries
import Animated from 'animated/lib/targets/react-dom';
import { keccak512 } from 'js-sha3';
import moment from 'moment';
import classNames from 'classnames';

// Import Components
import { faKey } from '@fortawesome/free-solid-svg-icons';
import ButtonXS from '../Common/Buttons/ButtonXS';
import { IconExportVault } from '../Common/Icon';
import FontRegular from '../Common/Fonts/FontRegular';
import IconInput from '../Common/Inputs/IconInput';

// Import Actions and Services
import { createToast } from '../../constants/toast';
import { exportVault } from '../../services/vaultService';
import { getLocalStorage, setLocalStorage } from '../../services/browserService';
import { expCreateExportElement } from '../../services/importExportService';
import FontError from '../Common/Fonts/FontError';

import {
  EXPORT_VAULT_HEIGHT,
  EXPORT_VAULT_ITEM,
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

function mapStateToProps(state) {
  return {
    pageStatus: state.appState.pageStatus,
    wallets: state.wallets.wallets,
    currentWallet: state.wallets.currentWallet,
    showSettings: state.animationReducer.showSettings,
    token: state.appState.token,
  };
}

const exportVaultInputHeight = settingsItemAnimatedMap.get(EXPORT_VAULT_ITEM);

class ExportVault extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      pwd: '',
      error: false,
      highlightContainer: false,
    };
    getLocalStorage('exportVault').then(data => {
      if (data.exportVault !== undefined) {
        this.setState({
          pwd: data.exportVault.pwd,
          incorrect: data.exportVault.incorrect,
        });
      }
    });
  }

  static getDerivedStateFromProps(props) {
    if (props.showSettings === false) {
      Animated.timing(exportVaultInputHeight, {
        toValue: 0,
      }).start();
    }

    return null;
  }

  pwdChange = value => {
    this.setState({
      pwd: value,
    });
  };

  validateInput = hashKey => this.props.token !== hashKey;

  handelOnChange = evt => {
    const { name, value } = evt.target;
    this.setState({ [name]: value });
  };

  handleExport = () => {
    const {
      state: { pwd },
    } = this;
    const hashKey = keccak512(pwd);

    this.setState({ error: this.validateInput(hashKey) });

    if (this.validateInput(hashKey)) {
      this.props.createToast({
        message: 'Vault was not exported. Invalid Password.',
        type: 'error',
      });
      return;
    }

    try {
      exportVault(hashKey).then(data => {
        const element = expCreateExportElement(
          document,
          data,
          `UTC-${moment.utc().valueOf()}_vault`,
        );

        element.click();

        this.setState({
          pwd: '',
          showkey: true,
        });
        setLocalStorage('exportVault', this.state);
        this.props.createToast({
          message: 'Vault was successfully exported.',
          type: 'success',
        });

        highlightSettingItems();
        animateSettingItemOut(exportVaultInputHeight);
      });
    } catch (error) {
      this.setState({ incorrect: true });
      setLocalStorage('exportVault', this.state);
      this.props.createToast({
        message: 'Vault was not exported. Please try again.',
        type: 'error',
      });
    }
  };

  handleBlur = () => {
    this.setState({ touched: true });
    setLocalStorage('exportVault', this.state);
  };

  toggleExportVaultAnimation = () => {
    // Unhighlight Item
    unhighlightSettingItems(EXPORT_VAULT_ITEM);
    this.handleContainerMouseEnter();

    // Shrink Other Items
    shrinkSettingItems(EXPORT_VAULT_ITEM);
    // Reset State
    this.setState({ error: false, pwd: '' });
    // Expand Input
    animateSettingItemIn(exportVaultInputHeight, EXPORT_VAULT_HEIGHT);
  };

  handleContainerMouseEnter = () => {
    let highlightContainer = true;

    if (settingsItemHighlightMap.get(EXPORT_VAULT_ITEM)) {
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
    const { error, highlightContainer } = this.state;

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
        <div className="settings-export-vault-label" onClick={this.toggleExportVaultAnimation}>
          <IconExportVault className="settings-icon" />
          <FontRegular className="settings-title">Export Vault</FontRegular>
        </div>

        <Animated.div
          className="settings-export-vault-content"
          style={{
            height: exportVaultInputHeight,
            overflow: 'hidden',
          }}
        >
          <div className="settings-export-vault-input">
            <IconInput
              type="password"
              name="pwd"
              error={error}
              icon={faKey}
              placeholder="Enter Password"
              onChange={this.handelOnChange}
              value={this.state.pwd}
            />

            {error ? <FontError style={{ color: '#FF0000' }}>Invalid Password</FontError> : null}
          </div>
          <div className="settings-export-vault-button">
            <ButtonXS onClick={this.handleExport}>Export</ButtonXS>
          </div>
          <div className="settings-export-padding" />
        </Animated.div>
      </div>
    );
  }
}
function mapDispatchToProps(dispatch) {
  return {
    createToast: toastOptions => dispatch(createToast(toastOptions)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ExportVault);
