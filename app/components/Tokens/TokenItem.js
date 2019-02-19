import React, { Component } from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';

import { CopyToClipboard } from 'react-copy-to-clipboard';
import ReactTooltip from 'react-tooltip';
import FontBold from '../Common/Fonts/FontBold';
import FontLight from '../Common/Fonts/FontLight';
import FontRegular from '../Common/Fonts/FontRegular';
import { IconSelectToken, ListIconDelete } from '../Common/Icon';
import BlockiesAvatar from '../Common/BlockiesAvatar/BlockiesAvatar';
import { createToast } from '../../constants/toast';

import { changeSelectedToken } from '../../constants/tokens';
import { getCurrentWalletBalance } from '../../actions/wallet';

import './styles.css';
import { convertNumberToFormattedString } from '../../services/numberFormatter';

class TokenItem extends Component {
  getContractToolTipComponent() {
    const { token, selected } = this.props;
    const avatarClassNames = classNames({
      'token-item-token-icon': true,
      'token-item-token-icon-selected': selected,
    });
    const contractWithTooltip = (
      <div className="token-item-token-icon-container">
        <CopyToClipboard text={token.address}>
          <span onClick={this.handleCopyItem.bind(this, token)}>
            <BlockiesAvatar
              className={avatarClassNames}
              seed={token.address}
              tooltipId="blockiesAddress"
            />
          </span>
        </CopyToClipboard>
        <ReactTooltip id="blockiesAddress" type="dark" effect="solid">
          <span>Copy Token address</span>
        </ReactTooltip>
      </div>
    );
    const aionWithoutTooltip = (
      <div className="token-item-token-icon-container">
        <BlockiesAvatar className={avatarClassNames} seed={token.address} />
      </div>
    );
    if (token.symbol !== 'AION') {
      return contractWithTooltip;
    }
    return aionWithoutTooltip;
  }

  hideListOfTokens = async event => {
    event.stopPropagation();
    this.props.changeSelectedToken(this.props.token);
    await this.props.getCurrentWalletBalance();
    this.props.hideListOfTokens();
  };

  handleDeleteItem = (token, event) => {
    event.stopPropagation();
    this.props.deleteItem(token);
  };

  handleCopyItem = (token, event) => {
    event.stopPropagation();
    this.props.createToast({
      message: `${token.name.toUpperCase()} address has been copied to the clipboard.`,
      type: 'info',
    });
  };

  render() {
    const { token, selected } = this.props;

    return (
      <div
        className="token-item-container"
        onClick={this.hideListOfTokens}
        onContextMenu={
          token.address !== 'none' ? this.props.onContextMenu[0] : this.props.onContextMenu[1]
        }
      >
        {this.getContractToolTipComponent()}

        <div className="token-item-token-name">
          <FontBold style={{ fontSize: 20, lineHeight: '24px' }}>
            {token.name.toUpperCase()}
          </FontBold>
        </div>
        {selected ? (
          <div className="token-item-token-selected-icon">
            {token.symbol !== 'AION' ? (
              <span>
                <ListIconDelete
                  onClick={this.handleDeleteItem.bind(this, token)}
                  marginRight={20}
                  size={18}
                />
              </span>
            ) : null}

            <span>
              <IconSelectToken />
            </span>
          </div>
        ) : token.symbol !== 'AION' ? (
          <div
            className="token-item-token-selected-icon"
            onClick={this.handleDeleteItem.bind(this, token)}
          >
            <ListIconDelete size={18} />
          </div>
        ) : null}
        <div className="token-item-token-balance">
          <span style={{ display: 'block' }}>
            <FontLight
              style={{
                fontSize: 16,
                display: 'inline',
                marginRight: 13,
                lineHeight: '19px',
              }}
            >
              {`${convertNumberToFormattedString(
                token.balance.amount,
              )} ${token.symbol.toUpperCase()}`}
            </FontLight>
          </span>
          <span style={{ display: 'block' }}>
            <FontRegular
              style={{
                fontSize: 14,
                color: '#FFFFFF',
                opacity: 0.5,
                display: 'inline',
                lineHeight: '17px',
              }}
            >
              {token.balance.usd
                ? `$ ${convertNumberToFormattedString(token.balance.usd)} USD`
                : ''}
            </FontRegular>
          </span>
        </div>
        {this.props.contextMenuElement}
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  changeSelectedToken: token => dispatch(changeSelectedToken(token)),
  createToast: toastOptions => dispatch(createToast(toastOptions)),
  getCurrentWalletBalance: () => dispatch(getCurrentWalletBalance()),
});

export default connect(
  null,
  mapDispatchToProps,
)(TokenItem);
