import React, { Component } from 'react';

// Import Libraries
import { connect } from 'react-redux';

// Import actions
import { removeTokenFromList } from '../../actions/tokens';
import { createToast } from '../../constants/toast';
import { changeSelectedToken } from '../../constants/tokens';

// Import Components
import TokenItem from './TokenItem';
import TokenContextMenu from '../Common/ContextMenu';
import DarkDivider from '../Common/Divider/DarkDivider';
import { IconDelete } from '../Common/Icon';

// Import styles
import './styles.css';

const mapStateToProps = state => ({
  currentNetwork: state.networks.currentNetwork,
  sendTokenSavedState: state.appState.sendTokenSavedState,
  selectedToken: state.tokens.selectedToken,

  currentWallet: state.wallets.currentWallet,
});

class TokenList extends Component {
  handleDeleteItem = async (token, event) => {
    if (event !== undefined) event.stopPropagation();
    // Declare Variables
    const { address } = token;
    const {
      tokenList, currentNetwork, currentWallet, selectedToken
    } = this.props;

    // Remove Token
    const tokenRemoved = this.props.removeTokenFromList(address);

    // Display Toast
    if (tokenRemoved) {
      // Switch to AION
      const tokenIndex = tokenList[currentWallet.address][currentNetwork.value].findIndex(
        token => token.address === selectedToken.address,
      );
      const initialToken = tokenList[currentWallet.address][currentNetwork.value][0];

      if (tokenIndex === -1) {
        this.props.changeSelectedToken(initialToken);
      }

      // Hide List of Tokens
      await this.props.hideListOfTokens();
    }
  };

  render() {
    // Get Current Network Token List
    const {
      tokenList, currentNetwork, selectedToken, currentWallet
    } = this.props;
    let tokenListArr = [];

    const walletTokenObj = tokenList[currentWallet.address];
    if (!walletTokenObj) {
      tokenListArr = [];
    } else {
      tokenListArr = walletTokenObj[currentNetwork.value];
    }

    return (
      <div>
        {tokenListArr.map(token => {
          const contextMenuItems = [
            {
              label: 'Delete',
              icon: <IconDelete size={15} />,
              onClick: this.handleDeleteItem.bind(this, token),
            },
          ];

          if (!selectedToken) return <div key={token.id} />;
          const selected = token.name === selectedToken.name;
          return (
            <div key={token.id}>
              <TokenItem
                onContextMenu={this.props.itemOnContextMenu}
                token={token}
                hideListOfTokens={this.props.hideListOfTokens}
                selected={selected}
                deleteItem={this.handleDeleteItem}
                contextMenuElement={(
                  <TokenContextMenu
                    contextMenu={this.props.contextMenu}
                    menuItems={contextMenuItems}
                  />
)}
              />
              <DarkDivider
                style={{
                  color: '#FFFFFF',
                  marginTop: 27.5,
                  marginBottom: 21.5,
                  marginLeft: 40,
                  width: 278,
                  opacity: 0.2,
                }}
              />
            </div>
          );
        })}
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  removeTokenFromList: tokenAddress => dispatch(removeTokenFromList(tokenAddress)),
  createToast: toastOptions => dispatch(createToast(toastOptions)),
  changeSelectedToken: token => dispatch(changeSelectedToken(token)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TokenList);
