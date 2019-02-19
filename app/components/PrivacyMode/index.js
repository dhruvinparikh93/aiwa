import React, { Component } from 'react';
import { connect } from 'react-redux';

// Import Libraries
import Animated from 'animated/lib/targets/react-dom';
import classNames from 'classnames';

// Import Components
import FontRegular from '../Common/Fonts/FontRegular';
import { IconPrivacyMode, IconInfo } from '../Common/Icon';
import ToggleSwitch from '../Common/ToggleSwitch';

// Import Actions and Services
import { togglePrivacyMode } from '../../actions/dApp';
// Import Constants
import {
  PRIVACY_MODE_HEIGHT,
  PRIVACY_MODE_ITEM,
  settingsItemAnimatedMap,
  settingsItemHighlightMap,
} from '../../constants/animation';

// Import Services
import {
  shrinkSettingItems,
  animateSettingItemIn,
  unhighlightSettingItems,
} from '../../services/animationService';

import './styles.css';

function mapStateToProps(state) {
  return {
    pageStatus: state.appState.pageStatus,
    wallets: state.wallets.wallets,
    currentWallet: state.wallets.currentWallet,
    showSettings: state.animationReducer.showSettings,
    token: state.appState.token,
    privacyModeEnabled: state.security.privacyModeEnabled,
  };
}

// Declare Privacy mode content height
const privacyModeItemHeight = settingsItemAnimatedMap.get(PRIVACY_MODE_ITEM);

class PrivacyMode extends Component {
  constructor(props) {
    super(props);
    this.state = {
      highlightContainer: false,
    };
  }

  static getDerivedStateFromProps(props) {
    if (props.showSettings === false) {
      Animated.timing(privacyModeItemHeight, {
        toValue: 0,
      }).start();
    }

    return null;
  }

  handleTogglePrivacyMode = () => {
    this.props.togglePrivacyMode();
  };

  togglePrivacyModeAnimation = () => {
    // Unhighlight Item
    unhighlightSettingItems(PRIVACY_MODE_ITEM);
    this.handleContainerMouseEnter();

    // Shrink Other Items EXCEPT Privacy mode
    shrinkSettingItems(PRIVACY_MODE_ITEM);

    // Expand Info to display Input
    animateSettingItemIn(privacyModeItemHeight, PRIVACY_MODE_HEIGHT);
  };

  handleContainerMouseEnter = () => {
    let highlightContainer = true;

    if (settingsItemHighlightMap.get(PRIVACY_MODE_ITEM)) {
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
    const { highlightContainer } = this.state;
    const { privacyModeEnabled } = this.props;
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
        <div className="settings-privacy-mode-label">
          <IconPrivacyMode className="settings-icon" />
          <FontRegular className="settings-title">Privacy Mode </FontRegular>
          <div
            className="settings-privacy-mode-info-icon"
            onClick={() => this.togglePrivacyModeAnimation()}
          >
            <IconInfo />
          </div>
          <div className="settings-privacy-mode-toggle">
            <div className="setting-privacy-mode-toggle-switch">
              <ToggleSwitch
                enabled={privacyModeEnabled}
                theme="small"
                onStateChanged={this.handleTogglePrivacyMode}
              />
            </div>
          </div>
        </div>

        <Animated.div
          className="settings-privacy-mode-content"
          style={{
            height: privacyModeItemHeight,
            overflow: 'hidden',
          }}
        >
          <div className="settings-privacy-mode-info">
            <FontRegular className="settings-privacy-mode-info-text">
              Websites must request access to view your account information.
            </FontRegular>
          </div>
          <div className="settings-export-padding" />
        </Animated.div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    togglePrivacyMode: () => dispatch(togglePrivacyMode()),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PrivacyMode);
