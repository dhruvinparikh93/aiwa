import React, { Component } from 'react';
import { connect } from 'react-redux';
import { changePageStatus } from '../../constants/common';
import { IconConnect } from '../Common/Icon';
import ButtonMD from '../Common/Buttons/ButtonMD';
import { removeLocalStorage, sendMessage } from '../../services/browserService';
import BlockiesAvatar from '../Common/BlockiesAvatar/BlockiesAvatar';
import { getBigFavicon } from '../Common/Favicon';
import FontRegular from '../Common/Fonts/FontRegular';
import { AddWhiteListedDApp } from '../../actions/dApp';
import './styles.css';

function mapStateToProps(state) {
  return {
    currentWallet: state.wallets.currentWallet,
    connectRequestDetails: state.security.connectRequestDetails,
    whiteListedDApp: state.security.whiteListedDApp,
  };
}

class ConnectRequest extends Component {
  connect = async e => {
    this.props.AddWhiteListedDApp(this.props.connectRequestDetails.origin);
    await removeLocalStorage(['popupContent']);
    this.props.changePageStatus('home');
    await sendMessage({
      result: 'connect_privacy',
      data: [this.props.currentWallet.address],
    });
    e.preventDefault();
  };

  cancel = async e => {
    const { changePageStatus } = this.props;
    await removeLocalStorage(['popupContent']);
    changePageStatus('home');
    await sendMessage({
      result: 'cancel_privacy',
      data: { message: 'The user cancelled connect request' },
    });
    e.preventDefault();
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
      currentWallet: { alias, address },
    } = this.props;
    const {
      connectRequestDetails: { favIconUrl, url },
    } = this.props;

    return (
      <div className="connect-request-grid-container">
        <div className="connect-request-header">
          <div className="connect-request-title">Connect Request</div>
        </div>
        <div className="connect-request-main">
          <div className="connect-request-account-container">
            <div className="connect-request-account-dapp-favicon">{getBigFavicon(favIconUrl)}</div>
            <div className="connect-request-account-connect">
              <div className="connect-request-account-connect-icon">
                <IconConnect />
              </div>
            </div>
            <div className="connect-request-account-address">
              <BlockiesAvatar seed={address} className="connect-request-account-addr-icon" />
            </div>
            <div className="connect-request-account-alias">{alias}</div>
            <div className="connect-request-account-dapp-url">{url}</div>
          </div>
          <div className="connect-request-prompt-info">
            <FontRegular style={{ fontSize: 14 }}>
              You are seeing this message because you have privacy mode enabled. The site is
              requesting access to interact with your wallet.
            </FontRegular>
          </div>
        </div>
        <div className="connect-request-button-cancel">
          <ButtonMD color="primary" onClick={this.cancel}>
            Cancel
          </ButtonMD>
        </div>
        <div className="connect-request-button-connect">
          <ButtonMD color="secondary" onClick={this.connect}>
            Connect
          </ButtonMD>
        </div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    changePageStatus: newPage => dispatch(changePageStatus(newPage)),
    AddWhiteListedDApp: origin => dispatch(AddWhiteListedDApp(origin)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ConnectRequest);
