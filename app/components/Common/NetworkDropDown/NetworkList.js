import React, { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

// Import Other Components
import Animated from 'animated/lib/targets/react-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faHashtag, faGlobe } from '@fortawesome/free-solid-svg-icons';

// Import Validation Object and rules
import AiwaValidator from '../../../utils/AiwaValidator';
import validator from '../../../utils/AiwaValidator/validator';
import { WINDOW } from '../../../constants/environment';

// Import Common Component
import config from '../../../app.config';
import FontError from '../Fonts/FontError';
import ButtonXS from '../Buttons/ButtonXS';
import IconInput from '../Inputs/IconInput';
import { INPUT_NUMBER_REGEX } from '../../../constants/regex';
// Import Actions and Constants
import {
  HOME_PAGE,
  SIGN_IN_PAGE,
  CREATE_VAULT_PAGE,
  IMPORT_VAULT_PAGE,
  TERMS_PAGE,
  DAPP_PAGE_GROUP,
} from '../../../constants/navigation';
import {
  NETWORK_DROPDOWN_SETTINGS,
  CUSTOM_NETWORK_HEIGHT,
  NETWORK_LIST_HEIGHT,
  applicationSettingsAnimatedMap,
  toggleShowSettings,
} from '../../../constants/animation';
import { showNetworks, AION_NETWORK_LIST, ETH_NETWORK_LIST } from '../../../constants/networks';
import { changePageStatus } from '../../../constants/common';
import { createToast } from '../../../constants/toast';
import changeNetworkSettings from '../../../actions/network';
import { animateApplicationSetting } from '../../../services/animationService';
import toggleApplicationAnimationOff from '../../../actions/animation';

// Import Styles
import './styles.css';

const mapStateToProps = state => ({
  pageStatus: state.appState.pageStatus,
  currentNetwork: state.networks.currentNetwork,
  toastOptions: state.toast.toastOptions,
  showNetworkList: state.networks.showNetworkList,
  showSettings: state.animationReducer.showSettings,
  headerLastToggle: state.animationReducer.headerLastToggle,
  currentWallet: state.wallets.currentWallet,
  tokenList: state.tokens.tokenList,
  selectedToken: state.tokens.selectedToken,
  marketData: state.appState.marketData,
});

const networkListAnimatedHeight = applicationSettingsAnimatedMap.get(NETWORK_DROPDOWN_SETTINGS);

class NetworkList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      port:
        this.props.currentNetwork.text === 'Custom' ? this.props.currentNetwork.networkPort : '',
      url: this.props.currentNetwork.text === 'Custom' ? this.props.currentNetwork.networkURL : '',
      isCustom: this.props.currentNetwork.text === 'Custom' && this.props.showNetworkList,
      isCustomNetworkShow: true,
      customNetworkAnimatedHeight: new Animated.Value(0),
    };

    // Declare Validator as well as Wallet variables
    this.validator = new AiwaValidator(validator.customNetworkValidation);
  }

  getNetworkList() {
    const networkItems = config.currentWalletType === 'aionWallet' ? AION_NETWORK_LIST : ETH_NETWORK_LIST;

    const netowrkListComponent = networkItems.map((network, index) => {
      // Declare styles for network names list
      const networkListNameClassName = classNames({
        'network-list-network-name': true,
        'network-list-network-name-selected':
          this.props.currentNetwork.text === network.text
          || this.props.currentNetwork.value === network.value,
      });

      const dotColorClasses = `dot${index + 1}`;

      const dotClassName = classNames({
        'network-list-dot': true,
        [dotColorClasses]: true,
        'network-list-dot-selected':
          this.props.currentNetwork.text === network.text
          || this.props.currentNetwork.value === network.value,
      });

      if (network.text === 'Custom') {
        return (
          <div
            className="network-list-network-row"
            key={network.value}
            id={network.value}
            onClick={this.toggleCustomNetworkAnimation}
          >
            <span className={dotClassName} />
            <div id={network.value} className={networkListNameClassName}>
              {network.text}
            </div>
            {(this.props.currentNetwork.text === network.text
              || this.props.currentNetwork.value === network.value) && (
              <span className="network-list-check">
                <FontAwesomeIcon icon={faCheck} style={{ color: 'white', fontSize: 15 }} />
              </span>
            )}
          </div>
        );
      }
      return (
        <div
          className="network-list-network-row"
          key={network.value}
          id={network.value}
          onClick={e => this.networkChange(e)}
        >
          <span className={dotClassName} />
          <div id={network.value} className={networkListNameClassName}>
            {network.text}
          </div>
          {(this.props.currentNetwork.text === network.text
            || this.props.currentNetwork.value === network.value) && (
            <span className="network-list-check">
              <FontAwesomeIcon icon={faCheck} style={{ color: 'white', fontSize: 15 }} />
            </span>
          )}
        </div>
      );
    });

    return netowrkListComponent;
  }

  toggle = () => {
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

  networkChange = async e => {
    const Items = config.currentWalletType === 'aionWallet' ? AION_NETWORK_LIST : ETH_NETWORK_LIST;
    const item = Items.filter(x => x.value === e.target.id);
    if (this.isAppOnDApp()) return;
    const {
      props: {
        pageStatus, changePageStatus, createToast, currentWallet, changeNetworkSettings
      },
      state: { isCustom },
    } = this;
    try {
      if (item[0].text !== 'Custom') {
        this.setState({ isCustom: false });

        this.toggle();
        this.customNetworkShrink();
        await changeNetworkSettings(item[0], currentWallet.address);
        if (
          pageStatus !== SIGN_IN_PAGE
          && pageStatus !== CREATE_VAULT_PAGE
          && pageStatus !== IMPORT_VAULT_PAGE
          && pageStatus !== TERMS_PAGE
        ) {
          changePageStatus(HOME_PAGE);
        }
      } else if (isCustom) {
        this.setState({ isCustom: false });
        this.toggle();
      } else {
        this.setState({ isCustom: true });
      }
    } catch (error) {
      // console.log(error);
      createToast({
        message: 'Network couldn’t be switched. Please try again.',
        type: 'error',
      });
    }
  };

  changePort = e => {
    if (e.target.value === '' || INPUT_NUMBER_REGEX.test(e.target.value)) {
      const val = e.target.value;
      this.setState({ port: val });
    }
  };

  changeUrl = e => {
    const val = e.target.value;
    this.setState({ url: val });
  };

  customNetworkExpand = () => {
    Animated.spring(this.state.customNetworkAnimatedHeight, {
      toValue: CUSTOM_NETWORK_HEIGHT,
    }).start();
    this.setState({ isCustomNetworkShow: false });
  };

  customNetworkShrink = () => {
    Animated.timing(this.state.customNetworkAnimatedHeight, {
      toValue: 0,
      duration: 200,
    }).start();
    this.setState({ isCustomNetworkShow: true });
    this.setState({ customNetworkValidation: undefined });
  };

  toggleCustomNetworkAnimation = () => {
    if (this.isAppOnDApp()) return;
    if (this.state.isCustomNetworkShow) {
      this.customNetworkExpand();
    } else {
      this.customNetworkShrink();
    }
  };

  saveCustomNetwork = async () => {
    // Validate Fields
    const validation = this.validator.validate(this.state);
    this.setState({ customNetworkValidation: validation });

    // Return if Validation is incorrect
    if (!validation.isValid) return;

    const {
      state: { url, port },
      props: {
        pageStatus,
        changePageStatus,
        createToast,
        networkURL,
        networkPort,
        currentWallet,
        changeNetworkSettings,
      },
    } = this;
    this.setState({ isCustom: false });
    this.toggle();
    this.toggleCustomNetworkAnimation();
    if (networkURL === url && networkPort === port) {
      if (
        pageStatus !== SIGN_IN_PAGE
        && pageStatus !== CREATE_VAULT_PAGE
        && pageStatus !== IMPORT_VAULT_PAGE
        && pageStatus !== TERMS_PAGE
      ) {
        changePageStatus(HOME_PAGE);
      }
    } else {
      const { origin, pathname, search } = new URL(url);
      const finalurl = `${origin}:${port}${pathname}${search}`;
      const network = {
        text: 'Custom',
        value: 'custom',
        networkURL: url,
        networkPort: port,
        networkFullUrl: finalurl,
      };
      try {
        await changeNetworkSettings(network, currentWallet.address);
        if (
          pageStatus !== SIGN_IN_PAGE
          && pageStatus !== CREATE_VAULT_PAGE
          && pageStatus !== IMPORT_VAULT_PAGE
          && pageStatus !== TERMS_PAGE
        ) {
          changePageStatus(HOME_PAGE);
        }
      } catch (error) {
        createToast({
          message: 'Network couldn’t be switched. Please try again.',
          type: 'error',
        });
      }
    }
  };

  render() {
    const { customNetworkValidation } = this.state;
    return (
      <Animated.div>
        <Animated.div
          style={{
            height: networkListAnimatedHeight,
            overflow: 'hidden',
            background: '#004260',
          }}
        >
          <div className="network-list-container">{this.getNetworkList()}</div>
        </Animated.div>
        <Animated.div
          style={{
            height: this.state.customNetworkAnimatedHeight,
            overflow: 'hidden',
            background: '#004260',
          }}
        >
          <div className="custom-network-grid-container">
            <div className="custom-network-url">
              <IconInput
                placeholder="URL"
                type="text"
                icon={faGlobe}
                value={this.state.url}
                onChange={e => this.changeUrl(e)}
                error={
                  customNetworkValidation === undefined
                    ? false
                    : customNetworkValidation.url.isInvalid
                }
              />
              <FontError>
                {customNetworkValidation === undefined ? ' ' : customNetworkValidation.url.message}
              </FontError>
            </div>
            <div className="custom-network-port-number">
              <IconInput
                placeholder="Port number"
                type="text"
                icon={faHashtag}
                value={this.state.port}
                onChange={e => this.changePort(e)}
                error={
                  customNetworkValidation === undefined
                    ? false
                    : customNetworkValidation.port.isInvalid
                }
              />
              <FontError>
                {customNetworkValidation === undefined ? ' ' : customNetworkValidation.port.message}
              </FontError>
            </div>
            <div className="custom-network-button">
              <ButtonXS color="primary" onClick={() => this.saveCustomNetwork()}>
                Save
              </ButtonXS>
            </div>
          </div>
        </Animated.div>
      </Animated.div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  changePageStatus: page => dispatch(changePageStatus(page)),
  showNetworks: flag => dispatch(showNetworks(flag)),
  createToast: toastOptions => dispatch(createToast(toastOptions)),
  toggleShowSettings: bool => dispatch(toggleShowSettings(bool)),
  changeNetworkSettings: (network, address) => dispatch(changeNetworkSettings(network, address)),
  toggleApplicationAnimationOff: () => dispatch(toggleApplicationAnimationOff()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NetworkList);
