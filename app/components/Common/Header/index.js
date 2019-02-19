import React, { Component } from 'react';
import { connect } from 'react-redux';

// Import Other Library Component
import Animated from 'animated/lib/targets/react-dom';
import classNames from 'classnames';

// Import Other Common Components
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import FontHeader from '../Fonts/FontHeader';
import NetworkList from '../NetworkDropDown/NetworkList';
import Settings from '../Settings';
import { getLocalStorage, removeLocalStorage, sendMessage } from '../../../services/browserService';

// Import constants
import { WINDOW } from '../../../constants/environment';
import toggleApplicationAnimationOff from '../../../actions/animation';
import {
  ONBOARDING_PAGES_GROUP,
  CREATE_VAULT_PAGE,
  SEED_WORDS_ONBOARDING,
  HOME_PAGE,
  SIGN_IN_PAGE,
  IMPORT_VAULT_PAGE,
  DAPP_PAGE_GROUP,
  CREATE_VAULT_SEED_WORDS,
} from '../../../constants/navigation';
import { changePageStatus } from '../../../constants/common';
import { showNetworks } from '../../../constants/networks';
import {
  SETTINGS_HEIGHT,
  CREATE_VAULT_HEADER_HEIGHT,
  VAULT_SETTINGS,
  applicationSettingsAnimatedMap,
  toggleShowSettings,
} from '../../../constants/animation';

// Import images
import aiwaIcon from '../../../images/aiwa_logo_white.svg';

// Import Styles
import './styles.css';
import {
  animateApplicationSetting,
  shrinkAllApplicationSetting,
} from '../../../services/animationService';

const mapStateToProps = state => ({
  pageStatus: state.appState.pageStatus,
  showNetworkList: state.networks.showNetworkList,
  showSettings: state.animationReducer.showSettings,
  headerLastToggle: state.animationReducer.headerLastToggle,
  applicationLastToggle: state.animationReducer.applicationLastToggle,
});

const settingsAnimatedHeight = applicationSettingsAnimatedMap.get(VAULT_SETTINGS);
const AnimatedImg = Animated.createAnimatedComponent('img');

class HeaderUpdated extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showDropdown: false,
      containerHeight: new Animated.Value(55),
      titleWidth: new Animated.Value(0),
      subtitleSize: new Animated.Value(0),
      titleHeight: new Animated.Value(35),
    };
  }

  static getDerivedStateFromProps(props, state) {
    const { pageStatus } = props;

    if (pageStatus !== undefined) {
      if (
        pageStatus === CREATE_VAULT_PAGE
        || pageStatus === SEED_WORDS_ONBOARDING
        || pageStatus === SIGN_IN_PAGE
        || pageStatus === IMPORT_VAULT_PAGE
        || pageStatus === CREATE_VAULT_SEED_WORDS
      ) {
        Animated.parallel([
          Animated.spring(state.containerHeight, {
            toValue: CREATE_VAULT_HEADER_HEIGHT,
          }),
          Animated.spring(state.subtitleSize, { toValue: 1 }),
          Animated.spring(state.titleHeight, { toValue: 55 }),
        ]).start();
      } else {
        Animated.spring(state.containerHeight, { toValue: 55 }).start();
        Animated.spring(state.titleHeight, { toValue: 35 }).start();
        Animated.spring(state.subtitleSize, { toValue: 0 }).start();
      }

      if (ONBOARDING_PAGES_GROUP.indexOf(pageStatus) !== -1) {
        Animated.spring(state.titleWidth, { toValue: 1 }).start();
      } else if (ONBOARDING_PAGES_GROUP.indexOf(pageStatus) === -1) {
        Animated.spring(state.titleWidth, { toValue: 0 }).start();
      }
    }

    return null;
  }

  isAppOnboarding = () => {
    const { pageStatus } = this.props;
    return ONBOARDING_PAGES_GROUP.indexOf(pageStatus) !== -1 || window.AIWA_UI_TYPE === WINDOW;
  };

  isAppOnDApp = () => {
    const { pageStatus } = this.props;
    return window.AIWA_UI_TYPE === WINDOW && DAPP_PAGE_GROUP.indexOf(pageStatus) !== -1;
  };

  isAppOnCreateVault = () => {
    const { pageStatus } = this.props;
    return (
      CREATE_VAULT_PAGE === pageStatus
      || SEED_WORDS_ONBOARDING === pageStatus
      || IMPORT_VAULT_PAGE === pageStatus
      || CREATE_VAULT_SEED_WORDS === pageStatus
    );
  };

  handleTitleAnimationExit = () => {
    this.setState({ showDropdown: true });
  };

  handleHeadingClick = async () => {
    if (this.isAppOnboarding() || this.isAppOnCreateVault()) return;
    this.props.changePageStatus(HOME_PAGE);

    const dAppData = await getLocalStorage(['popupContent']);

    if (dAppData !== undefined) {
      await Promise.all([
        removeLocalStorage(['popupContent']),
        sendMessage({
          result: 'cancel-send',
          data: { message: 'The user cancelled sending transaction' },
        }),
      ]);
    }

    // Turn off all other animations within Reducer State
    this.props.toggleApplicationAnimationOff();
    shrinkAllApplicationSetting();
  };

  toggleSettings = () => {
    // Turn off all other animations within Reducer State
    this.props.toggleApplicationAnimationOff();

    // Toggle Reducer state bool
    this.props.toggleShowSettings(!this.props.showSettings);

    // This has been put here to avoid jankiness with Animation
    animateApplicationSetting(VAULT_SETTINGS, SETTINGS_HEIGHT);
  };

  render() {
    // Declare Variables
    const { dropdownComponent } = this.props;
    const {
      showDropdown, containerHeight, subtitleSize, titleWidth, titleHeight
    } = this.state;

    const dropDownElement = <div className="header-dropdown">{dropdownComponent}</div>;
    const settingsIcon = (
      <div className="header-settings" onClick={this.toggleSettings}>
        <FontAwesomeIcon icon={faCog} style={{ color: 'white', fontSize: 15, cursor: 'pointer' }} />
      </div>
    );

    // Initialize Class Names
    const headerContainerClassName = classNames({
      'header-container': true,
      'header-container-dropdown': showDropdown
        ? true
        : !this.isAppOnboarding() || this.isAppOnDApp(),
      'header-container-subtitle': this.isAppOnCreateVault(),
    });

    const headerTitleClassNames = classNames({
      'header-title': true,
      'header-title-top-position': this.isAppOnCreateVault(),
    });

    return (
      <div>
        <div>
          <Animated.div style={{ height: containerHeight }} className={headerContainerClassName}>
            {this.isAppOnCreateVault() ? (
              <Animated.div
                style={{
                  fontSize: subtitleSize.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 19],
                    extrapolate: 'extend',
                  }),
                }}
                className="header-subtitle"
              >
                Welcome to
              </Animated.div>
            ) : null}
            <div className={headerTitleClassNames}>
              <FontHeader
                style={{
                  width: titleWidth.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['22%', '100%'],
                    extrapolate: 'extend',
                  }),
                }}
              >
                <AnimatedImg
                  src={aiwaIcon}
                  alt="AIWA"
                  style={{
                    height: titleHeight,
                  }}
                  onClick={this.handleHeadingClick}
                />
              </FontHeader>
            </div>

            {this.isAppOnboarding() ? null : settingsIcon}
            {showDropdown
              ? dropDownElement
              : this.isAppOnboarding()
                ? this.isAppOnDApp()
                  ? dropDownElement
                  : null
                : dropDownElement}
          </Animated.div>

          <Animated.div
            style={{
              height: settingsAnimatedHeight,
              overflow: 'hidden',
              backgroundColor: '#004260',
            }}
          >
            <Settings />
          </Animated.div>

          <NetworkList />
        </div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    toggleShowSettings: bool => dispatch(toggleShowSettings(bool)),
    showNetworks: bool => dispatch(showNetworks(bool)),
    changePageStatus: newPage => dispatch(changePageStatus(newPage)),
    toggleApplicationAnimationOff: () => dispatch(toggleApplicationAnimationOff()),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HeaderUpdated);
