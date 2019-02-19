import React, { Component } from 'react';

// Import Libraries
import { connect } from 'react-redux';
import Animated from 'animated/lib/targets/react-dom';

// Import Actions and constants
import { showNetworks } from '../../../constants/networks';
import {
  NETWORK_DROPDOWN_SETTINGS,
  NETWORK_LIST_HEIGHT,
  toggleShowSettings,
} from '../../../constants/animation';
import toggleApplicationAnimationOff from '../../../actions/animation';
import { animateApplicationSetting } from '../../../services/animationService';
import { DAPP_PAGE_GROUP } from '../../../constants/navigation';
import { WINDOW } from '../../../constants/environment';

// Import images
import dropdownIcon from '../../../images/angle-down-solid.svg';

const mapStateToProps = state => ({
  pageStatus: state.appState.pageStatus,
  currentNetwork: state.networks.currentNetwork,
  showNetworkList: state.networks.showNetworkList,
  showSettings: state.animationReducer.showSettings,
});

const AnimatedImg = Animated.createAnimatedComponent('img');

class NetworkDropDown extends Component {
  constructor(props) {
    super(props);

    // Turn off all other animations within Reducer State
    this.props.toggleApplicationAnimationOff();

    this.state = {
      arrowDirection: new Animated.Value(0),
    };
  }

  static getDerivedStateFromProps(props, state) {
    const { showNetworkList } = props;

    if (showNetworkList) {
      Animated.spring(state.arrowDirection, {
        toValue: 100,
      }).start();

      return null;
    }

    if (!showNetworkList) {
      Animated.spring(state.arrowDirection, {
        toValue: 0,
      }).start();
    }

    return null;
  }

  toggleNetworkDropdown = () => {
    if (this.isAppOnDApp()) return;
    // Turn off all other animations within Reducer State
    this.props.toggleApplicationAnimationOff();

    // Toggle Reducer state bool
    this.props.showNetworks(!this.props.showNetworkList);

    // Expand Application Setting
    animateApplicationSetting(NETWORK_DROPDOWN_SETTINGS, NETWORK_LIST_HEIGHT);
  };

  isAppOnDApp = () => {
    const { pageStatus } = this.props;
    return window.AIWA_UI_TYPE === WINDOW && DAPP_PAGE_GROUP.indexOf(pageStatus) !== -1;
  };

  render() {
    return (
      <div className="network-dropdown-current-network-name" onClick={this.toggleNetworkDropdown}>
        <span className="network-dropdown-name ">{this.props.currentNetwork.text}</span>

        {this.isAppOnDApp() ? null : (
          <div className="network-dropdown-arrow-container">
            <AnimatedImg
              src={dropdownIcon}
              onContextMenu={this.handleOldWalletSelection}
              onClick={this.toggleWalletDropdownSetting}
              className="network-dropdown-arrow"
              alt="network-dropdown"
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
        )}
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  showNetworks: bool => dispatch(showNetworks(bool)),
  toggleShowSettings: bool => dispatch(toggleShowSettings(bool)),
  toggleApplicationAnimationOff: () => dispatch(toggleApplicationAnimationOff()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NetworkDropDown);
