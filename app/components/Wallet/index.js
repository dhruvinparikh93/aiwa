import React, { Component } from 'react';
import { connect } from 'react-redux';

// Import Library
import Animated from 'animated/lib/targets/react-dom';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileImport } from '@fortawesome/free-solid-svg-icons';
import ReactTooltip from 'react-tooltip';

// Import Components
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { IconSettings } from '../Common/Icon';
import WalletDropdown from '../WalletDropdown';
import BlockiesAvatar from '../Common/BlockiesAvatar/BlockiesAvatar';
import AccountSettings from '../Common/AccountSettings';

// Import Actions and constants
import { changePageStatus } from '../../constants/common';
import toggleApplicationAnimationOff from '../../actions/animation';
import {
  WALLET_SETTINGS_HEIGHT,
  WALLET_DROPDOWN_ITEM_HEIGHT,
  WALLET_DROPDOWN_INPUT_HEIGHT,
  WALLET_DROPDOWN,
  WALLET_SETTINGS,
  toggleWalletDropdown,
  toggleShowWalletSettings,
  applicationSettingsAnimatedMap,
} from '../../constants/animation';
import { createToast } from '../../constants/toast';
import { animateApplicationSetting } from '../../services/animationService';

// Import services
import { shortenAddress } from '../../services/walletService';

// Import images
import dropdownIcon from '../../images/angle-down-solid.svg';

// Import styles
import './styles.css';

const mapStateToProps = state => ({
  token: state.appState.token,
  toastOptions: state.toast.toastOptions,
  currentWallet: state.wallets.currentWallet,
  showWalletSettings: state.animationReducer.showWalletSettings,
  walletBalanceArr: state.wallets.walletBalanceArr,
  showWalletDropdown: state.animationReducer.showWalletDropdown,
});

const walletDropdownAnimatedHeight = applicationSettingsAnimatedMap.get(WALLET_DROPDOWN);
const walletSettingsAnimatedHeight = applicationSettingsAnimatedMap.get(WALLET_SETTINGS);

const AnimatedImg = Animated.createAnimatedComponent('img');

class Wallet extends Component {
  constructor(props) {
    super(props);

    this.props.toggleApplicationAnimationOff();

    this.state = {
      arrowDirection: new Animated.Value(0),
      copying: false,
    };
  }

  static getDerivedStateFromProps(props, state) {
    // Declare Variables
    const {
      walletBalanceArr,

      showWalletDropdown,
    } = props;
    const { arrowDirection } = state;

    if (walletBalanceArr.length !== 0) {
      if (showWalletDropdown) {
        Animated.spring(arrowDirection, {
          toValue: 100,
        }).start();

        return null;
      }

      if (!showWalletDropdown) {
        Animated.spring(arrowDirection, {
          toValue: 0,
        }).start();
      }
    }

    return null;
  }

  toggleCopyTextOn = () => {
    this.setState({
      copying: true,
    });
  };

  toggleCopyTextOff = () => {
    this.setState({
      copying: false,
    });
  };

  toggleCopyTextOn = () => {
    this.setState({
      copying: true,
    });
  };

  toggleCopyTextOff = () => {
    this.setState({
      copying: false,
    });
  };

  toggleWalletSetting = () => {
    // Turn off all other animations within Reducer State
    this.props.toggleApplicationAnimationOff();

    // Toggle Reducer state bool
    this.props.toggleShowWalletSettings(!this.props.showWalletSettings);

    // Expand Application Setting
    animateApplicationSetting(WALLET_SETTINGS, WALLET_SETTINGS_HEIGHT);
  };

  toggleWalletDropdownSetting = () => {
    // Turn off all other animations within Reducer State
    this.props.toggleApplicationAnimationOff();

    // Toggle Reducer state bool
    this.props.toggleWalletDropdown(!this.props.showWalletDropdown);

    const toValue = this.props.walletBalanceArr.length <= 3
      ? this.props.walletBalanceArr.length * WALLET_DROPDOWN_ITEM_HEIGHT
          + WALLET_DROPDOWN_INPUT_HEIGHT
          - 1
      : 252.5 - 1;

    // Expand Application Setting
    animateApplicationSetting(WALLET_DROPDOWN, toValue);
  };

  render() {
    const { currentWallet, showWalletDropdown } = this.props;
    const { copying } = this.state;

    const walletHeaderContainer = classNames({
      'wallet-container': true,
      'wallet-container-shadow': showWalletDropdown,
    });
    return (
      <div>
        <div className={walletHeaderContainer}>
          <div className="wallet-c1" onClick={this.toggleWalletDropdownSetting}>
            <BlockiesAvatar className="walletCircle" seed={currentWallet.address} />
            {currentWallet.imported && (
              <div className="wallet-imported-icon">
                <FontAwesomeIcon
                  icon={faFileImport}
                  className="wallet-imported-icon-image"
                  data-tip
                  data-for="importedWallet"
                />
                <ReactTooltip id="importedWallet" type="dark" effect="solid" place="right">
                  <span>Imported</span>
                </ReactTooltip>
              </div>
            )}
          </div>
          <div className="wallet-c2">
            <span>
              {currentWallet.alias}
              <br />
              <CopyToClipboard
                text={currentWallet.address}
                onCopy={() => {
                  this.props.createToast({
                    message: 'Your wallet address has been copied to the clipboard.',
                    type: 'info',
                  });
                }}
              >
                <span
                  className="walSubTitle"
                  onMouseEnter={this.toggleCopyTextOn}
                  onMouseLeave={this.toggleCopyTextOff}
                >
                  {copying ? 'Copy wallet address' : shortenAddress(currentWallet.address)}
                </span>
              </CopyToClipboard>
            </span>
          </div>
          <div className="wallet-c3">
            <div className="wallet-header-settings" onClick={this.toggleWalletSetting}>
              <IconSettings size={21} />
            </div>

            <div className="wallet-header-arrow-container">
              <AnimatedImg
                src={dropdownIcon}
                onClick={this.toggleWalletDropdownSetting}
                className="wallet-header-arrow"
                alt="wallet-dropdown"
                style={{
                  transform: [
                    {
                      rotate: this.state.arrowDirection.interpolate({
                        inputRange: [0, 100],
                        outputRange: ['0deg', '-180deg'],
                        extrapolate: 'extend',
                      }),
                    },
                  ],
                }}
              />
            </div>
          </div>
        </div>
        <Animated.div
          style={{
            height: walletSettingsAnimatedHeight,
            overflow: 'hidden',
            backgroundColor: '#005074',
          }}
        >
          <AccountSettings />
        </Animated.div>

        <Animated.div
          style={{
            height: walletDropdownAnimatedHeight,
            overflow: 'hidden',
            backgroundColor: '#005074',
          }}
        >
          <WalletDropdown walletBalanceArr={this.props.walletBalanceArr} />
        </Animated.div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  changePageStatus: newPage => dispatch(changePageStatus(newPage)),
  toggleShowWalletSettings: bool => dispatch(toggleShowWalletSettings(bool)),
  toggleWalletDropdown: bool => dispatch(toggleWalletDropdown(bool)),
  createToast: toastOptions => dispatch(createToast(toastOptions)),
  toggleApplicationAnimationOff: () => dispatch(toggleApplicationAnimationOff()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Wallet);
