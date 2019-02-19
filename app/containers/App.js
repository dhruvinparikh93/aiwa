import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Idle from 'react-idle';
import { ToastContainer } from 'react-toastify';
import HttpStatus from 'http-status-codes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import BlockUi from 'react-block-ui';
import { Loader } from 'react-loaders';
import 'react-block-ui/style.css';
import 'loaders.css/loaders.min.css';

// Import Components
import SignIn from '../components/SignIn';
import Terms from '../components/Terms';
import Home from '../components/Home/Home';
import SignTransaction from '../components/Sign/transaction';
import SignMessage from '../components/Sign/message';
import SendConfirm from '../components/SendConfirm';
import Deposit from '../components/Deposit';
import CreateVault from '../components/CreateVault';
import ImportVault from '../components/ImportVaultOnboarding';
import HeaderUpdated from '../components/Common/Header';
import NetworkDropDown from '../components/Common/NetworkDropDown';
import ConnectRequest from '../components/ConnectRequest';
import LoaderOverlay from '../components/LoaderOverlay';
import { WINDOW } from '../constants/environment';

import SendToken from '../components/SendToken';
import SeedWords from '../components/SeedWords';
import AddToken from '../components/AddToken';
import CreateVaultWithSeedWords from '../components/CreateVaultWithSeedWords';

// Import actions
import { verifyAcceptedTouVersion } from '../actions/home';
import { changePageStatus } from '../constants/common';
import { setBadgeText, getBadgeText } from '../services/browserService';
import { checkVault } from '../services/vaultService';
// Import Styles
import 'react-toastify/dist/ReactToastify.css';
import 'semantic-ui-css/semantic.css';
import './App.css';
import {
  HOME_PAGE,
  TERMS_PAGE,
  CREATE_VAULT_PAGE,
  SIGN_IN_PAGE,
  SEND_TRANSACTION_PAGE,
  CONFIRM_PAGE,
  DEPOSIT_PAGE,
  IMPORT_VAULT_PAGE,
  SIGN_TRANSACTION_PAGE,
  SIGN_MESSAGE_PAGE,
  SEED_WORDS,
  SEED_WORDS_ONBOARDING,
  ADD_TOKEN_PAGE,
  CONNECT_REQUEST_PAGE,
  CREATE_VAULT_SEED_WORDS,
  LOADER_OVERLAY,
} from '../constants/navigation';
import { checkConnectivity } from '../services/watcherService';

// start all watchers
checkConnectivity();
// end all watchers

function mapStateToProps(state) {
  return {
    pageStatus: state.appState.pageStatus,
    isTermsAgree: state.appState.isTermsAgree,
    timeout: state.appState.timeout,
    isUpdatedTouVersion: state.appState.isUpdatedTouVersion,
    isNetworkConnected: state.appState.isNetworkConnected,
    statusCode: state.appState.statusCode,
    currentNetwork: state.networks.currentNetwork,
    currentWallet: state.wallets.currentWallet,
    isLoading: state.appState.isLoading,
  };
}
class App extends Component {
  static propTypes = {
    pageStatus: PropTypes.string,
    changePageStatus: PropTypes.func,
    verifyAcceptedTouVersion: PropTypes.func,
    isTermsAgree: PropTypes.bool,
  };

  static defaultProps = {
    pageStatus: HOME_PAGE,
    changePageStatus: undefined,
    verifyAcceptedTouVersion: undefined,
    isTermsAgree: false,
  };

  constructor(props, context) {
    super(props, context);
    checkVault().then(data => {
      if (data !== undefined && data != null && data.length > 0) {
        getBadgeText().then(res => {
          if (res !== undefined && res !== null && res !== '') {
            setBadgeText('');
            this.props.changePageStatus(HOME_PAGE);
          }
        });
        setBadgeText('');
      } else if (this.props.isTermsAgree === undefined || this.props.isTermsAgree === false) {
        this.props.changePageStatus(TERMS_PAGE);
      } else this.props.changePageStatus(CREATE_VAULT_PAGE);
    });
    this.state = {
      prevConnection: true,
      msg: '',
      isShow: false,
    };
  }

  componentDidMount() {
    this.props.verifyAcceptedTouVersion();
    this.verifyConnection();
  }

  componentDidUpdate() {
    this.verifyConnection();
  }

  /*eslint-disable-next-line no-unused-vars */
  static getDerivedStateFromProps(props, state) {
    if (props.isUpdatedTouVersion) {
      props.changePageStatus(TERMS_PAGE);
    }
    if (window.AIWA_UI_TYPE === WINDOW && props.pageStatus === HOME_PAGE) {
      props.changePageStatus(LOADER_OVERLAY);
    }
    if (window.AIWA_UI_TYPE !== WINDOW && props.pageStatus === LOADER_OVERLAY) {
      props.changePageStatus(HOME_PAGE);
    }
    return null;
  }

  timeout = idle => {
    if (
      idle
      && this.props.pageStatus !== SIGN_IN_PAGE
      && this.props.pageStatus !== CREATE_VAULT_PAGE
      && this.props.pageStatus !== IMPORT_VAULT_PAGE
      && this.props.pageStatus !== TERMS_PAGE
    ) {
      this.props.changePageStatus(SIGN_IN_PAGE);
    }
  };

  closemsg = () => {
    this.setState({ isShow: false });
  };

  verifyConnection() {
    const {
      props: { isNetworkConnected, statusCode },
      state: { prevConnection },
    } = this;
    let message = '';
    if (statusCode === 0) {
      message = 'Internet connection is offline';
    } else if (statusCode === HttpStatus.INTERNAL_SERVER_ERROR) {
      message = 'Provider internal server error';
    } else if (statusCode === HttpStatus.REQUEST_TIMEOUT) {
      message = 'Provider timeout';
    } else if (statusCode === HttpStatus.UNAUTHORIZED) {
      message = 'Provider access permission error';
    } else if (statusCode === HttpStatus.OK) {
      message = 'Provider is online';
    } else {
      message = 'Provider internal server error';
    }

    if (isNetworkConnected !== prevConnection) {
      if (isNetworkConnected) {
        this.setState({
          msg: message,
          prevConnection: isNetworkConnected,
          isShow: true,
        });
        setTimeout(() => {
          this.setState({ isShow: false });
        }, 3000);
      } else {
        this.setState({
          msg: message,
          prevConnection: isNetworkConnected,
          isShow: true,
        });
      }
    }
  }

  render() {
    let component = null;
    const {
      props: { pageStatus, isNetworkConnected, isLoading },
      state: { msg, isShow },
    } = this;
    switch (pageStatus) {
      case TERMS_PAGE:
        component = <Terms />;
        break;
      case HOME_PAGE:
        component = <Home />;
        break;
      case SEND_TRANSACTION_PAGE:
        component = <SendToken />;
        break;
      case CONFIRM_PAGE:
        component = <SendConfirm />;
        break;
      case DEPOSIT_PAGE:
        component = <Deposit />;
        break;
      case CREATE_VAULT_PAGE:
        component = <CreateVault />;
        break;
      case IMPORT_VAULT_PAGE:
        component = <ImportVault />;
        break;
      case SIGN_TRANSACTION_PAGE:
        component = <SignTransaction />;
        break;
      case SIGN_MESSAGE_PAGE:
        component = <SignMessage />;
        break;
      case SEED_WORDS:
        component = <SeedWords />;
        break;
      case SEED_WORDS_ONBOARDING:
        component = <SeedWords />;
        break;
      case ADD_TOKEN_PAGE:
        component = <AddToken />;
        break;
      case CONNECT_REQUEST_PAGE:
        component = <ConnectRequest />;
        break;
      case CREATE_VAULT_SEED_WORDS:
        component = <CreateVaultWithSeedWords />;
        break;
      case LOADER_OVERLAY:
        component = <LoaderOverlay />;
        break;
      case 'signin':
      case SIGN_IN_PAGE:
      default:
        component = <SignIn />;
    }
    return (
      <BlockUi
        tag="div"
        blocking={isLoading}
        loader={<Loader active type="semi-circle-spin" color="#1f5771" />}
      >
        <div className="app">
          {isShow && (
            <div
              className="offlineError"
              style={{ backgroundColor: isNetworkConnected ? 'green' : 'red' }}
            >
              {isNetworkConnected === false && (
                <FontAwesomeIcon
                  icon={faExclamationTriangle}
                  style={{ color: 'white', paddingRight: 5 }}
                />
              )}
              {msg}
            </div>
          )}
          <HeaderUpdated dropdownComponent={<NetworkDropDown />} />
          <ToastContainer />
          {component}
          <Idle timeout={this.props.timeout} onChange={({ idle }) => this.timeout(idle)} />
        </div>
      </BlockUi>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    changePageStatus: newPage => dispatch(changePageStatus(newPage)),
    verifyAcceptedTouVersion: () => dispatch(verifyAcceptedTouVersion()),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
