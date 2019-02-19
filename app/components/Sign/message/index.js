import React, { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { changePageStatus } from '../../../constants/common';
import Wallet from '../../../apis/wallet/wallet';
import { IconDisclaimer } from '../../Common/Icon';
import ButtonMD from '../../Common/Buttons/ButtonMD';
import { getFavicon } from '../../Common/Favicon';
import SubHeader from '../../Common/SubHeader';
import { HOME_PAGE } from '../../../constants/navigation';
import { POPUP, WINDOW } from '../../../constants/environment';
import { toFormat } from '../../../services/numberFormatter';
import { removeLocalStorage, sendMessage } from '../../../services/browserService';
import './styles.css';

function mapStateToProps(state) {
  return {
    pageStatus: state.appState.pageStatus,
    currentWallet: state.wallets.currentWallet,
    msgDetails: state.message.msgDetails,
    currentWalletBalance: state.wallets.currentWalletBalance,
    selectedToken: state.tokens.selectedToken,
  };
}

class SignMessage extends Component {
  constructor(props) {
    super(props);

    // Get Data from Selected Token

    this.state = {
      balance: 0,
      usdBalance: 0,
    };
  }

  static getDerivedStateFromProps(props) {
    let newState = null;
    if (props.currentWalletBalance) {
      const {
        balance: { amount, usd },
      } = props.currentWalletBalance.selectedToken;
      newState = {
        balance: amount,
        usdBalance: usd || '',
        ...newState,
      };
    }
    return newState;
  }

  sign = async e => {
    const {
      changePageStatus,
      msgDetails: {
        args: { message },
      },
    } = this.props;
    const wallet = new Wallet(this.props.currentWallet.privateKey);
    await removeLocalStorage(['popupContent']);
    changePageStatus(HOME_PAGE);
    const res = await wallet.sign(message);
    await sendMessage({ result: 'signed', data: res });
    e.preventDefault();
  };

  cancel = async e => {
    const { changePageStatus } = this.props;
    await removeLocalStorage(['popupContent']);
    changePageStatus(HOME_PAGE);
    await sendMessage({
      result: 'cancel-sign',
      data: { message: 'The user cancelled signature request' },
    });
    e.preventDefault();
  };

  handleSubheaderBackBtn = async () => {
    await removeLocalStorage(['popupContent']);
    this.props.changePageStatus(HOME_PAGE);
  };

  shortenURL(url) {
    if (url.length > 29) {
      return `${url.substring(0, 29)}...`;
    }
    return url;
  }

  shortAddHex(val) {
    let str = '';
    if (val !== undefined) {
      if (val === null) return val;
      if (val.length > 8) {
        str = val.substring(0, 6);
        str += '...';
        str += val.substring(val.length - 4, val.length);
        return str;
      }
    }
    return val;
  }

  render() {
    const {
      props: {
        currentWallet: { alias },
        msgDetails: {
          args: { signer, message },
          dApp: { url, favIconUrl },
        },
      },
    } = this;
    const signDataContainer = classNames({
      'sign-data-container-popup': window.AIWA_UI_TYPE === POPUP,
      'sign-data-container-window': window.AIWA_UI_TYPE === WINDOW,
    });
    return (
      <div>
        {window.AIWA_UI_TYPE === POPUP && (
          <SubHeader title="Sign Message" backBtnOnClick={this.handleSubheaderBackBtn} />
        )}
        <div className={signDataContainer} onScroll={this.handleScroll}>
          <div className="sign-data-dapp">
            <div className="sign-data-dapp-favIcon">{getFavicon(favIconUrl)}</div>
            <div className="sign-data-dapp-url">{`Request from ${this.shortenURL(url)}`}</div>
          </div>
          <div className="sign-data-request-text">Signature Request</div>
          <div className="sign-data-account-container">
            <div className="sign-data-account-text">Account</div>
            <div className="sign-data-account-balance">Balance</div>
            <div className="sign-data-account-alias">{alias}</div>
            <div className="sign-data-account-token-balance">
              {`${Number(this.state.balance).toFixed(2)} AION`}
            </div>
            <div className="sign-data-account-address">{this.shortAddHex(signer)}</div>
            <div className="sign-data-account-token-balance-usd">
              {`${toFormat(this.state.usdBalance)} USD`}
            </div>
          </div>
          <div className="sign-data-disclaimer-container">
            <div className="sign-data-disclaimer-notice-container">
              <div className="sign-data-disclaimer-notice-icon">
                <IconDisclaimer />
              </div>
              <div className="sign-data-disclaimer-notice-text">
                <p>Disclaimer</p>
                Signing can provide access to the value of your account. Only sign this if you know
                and trust the requesting source.
              </div>
            </div>
          </div>
          <div className="sign-data-message-header">Message</div>
          <div className="sign-data-message-container">{message}</div>
          <div className="sign-data-button-container">
            <div className="sign-data-button-cancel">
              <ButtonMD color="primary" onClick={this.cancel}>
                Cancel
              </ButtonMD>
            </div>
            <div className="sign-data-button-sign">
              <ButtonMD color="secondary" onClick={this.sign}>
                Sign
              </ButtonMD>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    changePageStatus: newPage => dispatch(changePageStatus(newPage)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SignMessage);
