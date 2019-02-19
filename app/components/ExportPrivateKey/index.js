import React, { Component } from 'react';
import { connect } from 'react-redux';

// Import Libraries
import Animated from 'animated/lib/targets/react-dom';
import { keccak512 } from 'js-sha3';
import classNames from 'classnames';

// Import Components
import { faKey } from '@fortawesome/free-solid-svg-icons';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import ButtonXS from '../Common/Buttons/ButtonXS';
import FontRegular from '../Common/Fonts/FontRegular';

import { IconPrivateKey, IconCopy } from '../Common/Icon';
import IconInput from '../Common/Inputs/IconInput';

// Import Actions and Services
import { createToast } from '../../constants/toast';
import FontError from '../Common/Fonts/FontError';
// Import Constants
import {
  EXPORT_PRIVATE_KEY_INPUT_HEIGHT,
  EXPORT_PRIVATE_KEY_DISPLAY_HEIGHT,
  EXPORT_PRIVATE_KEY_ITEM,
  walletSettingsItemAnimatedMap,
  walletSettingsItemHighlightMap,
} from '../../constants/animation';

// Import Services
import {
  animateWalletSettingItemIn,
  animateWalletSettingItemOut,
  unhighlightWalletSettingItems,
  highlightWalletSettingItems,
  shrinkWalletSettingItems,
} from '../../services/animationService';
import { removeZeroX } from '../../services/walletService';
import './styles.css';

function mapStateToProps(state) {
  return {
    currentWallet: state.wallets.currentWallet,
    showWalletSettings: state.animationReducer.showWalletSettings,
    token: state.appState.token,
  };
}

// Declare Export private key Input Height
const exportPrivateKeyItemHeight = walletSettingsItemAnimatedMap.get(EXPORT_PRIVATE_KEY_ITEM);

class ExportPrivateKey extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pwd: '',
      error: false,
      privateKey: '',
      showPrivateKey: false,
      highlightContainer: false,
      privateKeyHighlight: false,
    };
  }

  static getDerivedStateFromProps(props) {
    if (props.showWalletSettings === false) {
      Animated.timing(exportPrivateKeyItemHeight, {
        toValue: 0,
      }).start();
    }

    return null;
  }

  toggleExportPrivateKeyInputAnimation = () => {
    // Unhighlight Item
    unhighlightWalletSettingItems(EXPORT_PRIVATE_KEY_ITEM);
    this.handleContainerMouseEnter();

    this.setState({
      pwd: '',
      error: false,
      showPrivateKey: false,
      privateKey: '',
    });

    // Shrink Other Items EXCEPT Private key if any
    shrinkWalletSettingItems(EXPORT_PRIVATE_KEY_ITEM);

    // Expand Export Private Key to display Input
    animateWalletSettingItemIn(exportPrivateKeyItemHeight, EXPORT_PRIVATE_KEY_INPUT_HEIGHT);
  };

  toggleExportPrivatekeyDisplayAnimation = () => {
    // Shrink Other Items EXCEPT private key if any
    shrinkWalletSettingItems(EXPORT_PRIVATE_KEY_ITEM);

    // Expand Export private key to display private key div
    animateWalletSettingItemIn(exportPrivateKeyItemHeight, EXPORT_PRIVATE_KEY_DISPLAY_HEIGHT + 40);
  };

  handelOnChange = event => {
    const { value } = event.target;
    this.setState({ pwd: value });
  };

  handleExport = async () => {
    const {
      props: { token },
      state: { pwd },
    } = this;

    const hashKey = keccak512(pwd);
    this.setState({ error: false });

    if (hashKey === token) {
      try {
        const { privateKey } = this.props.currentWallet;
        if (privateKey !== undefined) {
          animateWalletSettingItemOut(exportPrivateKeyItemHeight, () => {
            this.setState({ privateKey: removeZeroX(privateKey), showPrivateKey: true }, () => {
              Animated.delay(250).start(() => {
                this.toggleExportPrivatekeyDisplayAnimation();
              });
            });
          });
        }
      } catch (err) {
        throw err;
      }
    } else {
      this.setState({ error: true });
    }
  };

  handleExportCopyToClipboard = () => {
    // Animate Setings out
    highlightWalletSettingItems();
    animateWalletSettingItemOut(exportPrivateKeyItemHeight, () => {
      Animated.delay(250).start(() => {
        this.setState({
          pwd: '',
          error: false,
          showPrivateKey: false,
          privateKey: '',
        });
      });
    });

    // Show Toast once private key copied to clipboard
    this.props.createToast({
      message: 'Private key have been copied to clipboard.',
      type: 'success',
    });
  };

  handleHighlightPrivateKeyEnter = () => {
    this.setState({
      privateKeyHighlight: true,
    });
  };

  handleHighlightPrivateKeyLeave = () => {
    this.setState({
      privateKeyHighlight: false,
    });
  };

  handleContainerMouseEnter = () => {
    let highlightContainer = true;

    if (walletSettingsItemHighlightMap.get(EXPORT_PRIVATE_KEY_ITEM)) {
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
      error,
      showPrivateKey,
      privateKey,
      highlightContainer,
      privateKeyHighlight,
    } = this.state;

    const privateKeyPhraseClassName = classNames({
      'account-settings-export-private-key-phrase': true,
      'account-settings-export-private-key-phrase-highlighted': privateKeyHighlight,
    });

    const privateKeyPhraseCopyIconClassName = classNames({
      'account-settings-export-private-key-copy-icon': !privateKeyHighlight,
      'account-settings-export-private-key-copy-icon-highlighted': privateKeyHighlight,
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
        <div
          className="account-settings-export-private-key-label"
          onClick={() => this.toggleExportPrivateKeyInputAnimation()}
        >
          <IconPrivateKey className="account-settings-icon" />
          <FontRegular className="account-settings-title">Export Private Key</FontRegular>
        </div>

        <Animated.div
          className="account-settings-export-private-key-content"
          style={{
            height: exportPrivateKeyItemHeight,
            overflow: 'hidden',
          }}
        >
          {showPrivateKey === false && (
            <div className="account-settings-export-private-key-input">
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
          )}
          {showPrivateKey === false && (
            <div className="account-settings-export-private-key-button">
              <ButtonXS onClick={this.handleExport}>View</ButtonXS>
            </div>
          )}
          {showPrivateKey && (
            <div className="account-settings-export-private-key-reveal" style={{ paddingLeft: 5 }}>
              <CopyToClipboard text={this.state.privateKey}>
                <span
                  className={privateKeyPhraseClassName}
                  onClick={this.handleExportCopyToClipboard}
                  onMouseEnter={this.handleHighlightPrivateKeyEnter}
                  onMouseLeave={this.handleHighlightPrivateKeyLeave}
                >
                  {privateKey}
                </span>
              </CopyToClipboard>
            </div>
          )}
          {showPrivateKey && (
            <div
              className="account-settings-export-private-key-button"
              style={{
                alignSelf: 'center',
              }}
            >
              <CopyToClipboard text={this.state.privateKey}>
                <span
                  className={privateKeyPhraseCopyIconClassName}
                  onClick={this.handleExportCopyToClipboard}
                  onMouseEnter={this.handleHighlightPrivateKeyEnter}
                  onMouseLeave={this.handleHighlightPrivateKeyLeave}
                >
                  <IconCopy />
                </span>
              </CopyToClipboard>
            </div>
          )}
          <div className="account-settings-export-padding" />
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
)(ExportPrivateKey);
