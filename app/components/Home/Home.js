import React, { Component } from 'react';
import { connect } from 'react-redux';
import Animated from 'animated/lib/targets/react-dom';

import Modal from 'react-modal';
import { changePageStatus } from '../../constants/common';
import { changeSelectedToken } from '../../constants/tokens';
import { getCurrentWalletBalance } from '../../actions/wallet';
import { fetchAionCoinDetails, initializeWallet } from '../../actions/home';
import { SIGN_IN_PAGE } from '../../constants/navigation';
import { fetchTokenListBalance } from '../../actions/tokens';

import Transactions from '../Transactions/Transactions';
import TokenDetails from '../TokenDetails';
import Wallet from '../Wallet';
import Tokens from '../Tokens';
import { IconWindowClose } from '../Common/Icon';
import Input from '../Common/Inputs/Input';
import ButtonLG from '../Common/Buttons/ButtonLG';
import { addContactToAddressBook } from '../../actions/vault';
import { updateAddressDialog } from '../../constants/vaults';

import './styles.css';
import FontBold from '../Common/Fonts/FontBold';
import FontRegular from '../Common/Fonts/FontRegular';

function mapStateToProps(state) {
  return {
    wallets: state.wallets.wallets,
    currentWallet: state.wallets.currentWallet,
    transactions: state.transactions.transactions,
    currentNetwork: state.networks.currentNetwork,
    tokenList: state.tokens.tokenList,
    selectedToken: state.tokens.selectedToken,
    marketData: state.appState.marketData,
    addressBook: state.vaults.addressBook === undefined ? [] : state.vaults.addressBook,
    openAddressDialog: state.vaults.openAddressDialog,
  };
}

class Home extends Component {
  constructor(props) {
    super(props);
    // Declare Variables
    const { currentWallet } = this.props;

    if (currentWallet === undefined) {
      this.props.changePageStatus(SIGN_IN_PAGE);
    }
    this.state = {
      dashboardWidth: new Animated.Value(360),
      tokenListWidth: new Animated.Value(0),
      contextMenu: {
        show: false,
        top: 0,
        left: 0,
      },
      isOpen:
        this.props.openAddressDialog === undefined ? false : this.props.openAddressDialog.isOpen,
      address:
        this.props.openAddressDialog === undefined ? '' : this.props.openAddressDialog.address,
      alias: '',
      disabled: true,
    };
  }

  componentDidMount() {
    this.props.initializeWallet();
  }

  static getDerivedStateFromProps(props, state) {
    const newState = {
      isOpen: props.openAddressDialog === undefined ? false : props.openAddressDialog.isOpen,
      address: props.openAddressDialog === undefined ? '' : props.openAddressDialog.address,
      alias: state.alias,
      disabled: state.disabled,
    };
    return newState;
  }

  addToAddressBook = () => {
    const {
      state: { address, alias },
      props: { addContactToAddressBook, addressBook, updateAddressDialog },
    } = this;
    addContactToAddressBook(address, alias, addressBook);
    updateAddressDialog(undefined);
  };

  closeModal = () => {
    const {
      props: { updateAddressDialog },
    } = this;

    this.setState({ isOpen: false });
    updateAddressDialog(undefined);
  };

  handleOnChange = event => {
    const { name, value } = event.target;

    const state = {
      [name]: value,
    };
    this.setState(state);
    if (value === '') {
      this.setState({ disabled: true });
    } else {
      this.setState({ disabled: false });
    }
  };

  showListOfTokens = () => {
    Animated.parallel([
      // after decay, in parallel:
      Animated.timing(this.state.tokenListWidth, {
        toValue: 360,
        duration: 250,
      }),
      Animated.timing(this.state.dashboardWidth, {
        toValue: 0,
        duration: 250,
      }),
    ]).start(() => {
      this.props.fetchTokenListBalance();
    }); // start the sequence group
  };

  hideListOfTokens = () => {
    this.setState({
      contextMenu: {
        show: false,
      },
    });
    Animated.timing(this.state.dashboardWidth, {
      toValue: 360,
      duration: 250,
    }).start();

    Animated.timing(this.state.tokenListWidth, {
      toValue: 0,
      duration: 250,
    }).start();
  };

  handleTokenListContextMenu = event => {
    event.stopPropagation();
    event.preventDefault();

    const width = 150;
    const height = 35;

    const left = event.clientX + width + 5 >= window.innerWidth ? event.clientX - 150 + 5 : event.clientX + 5;
    const top = event.clientY + height + 5 >= window.innerHeight
      ? event.clientY - 150 + 5
      : event.clientY + 5;

    this.setState({
      contextMenu: {
        show: true,
        left,
        top,
      },
    });
  };

  handleHideTokenListContextMenu = event => {
    event.preventDefault();

    this.setState({
      contextMenu: {
        show: false,
      },
    });
  };

  render() {
    const {
      state: { alias, address },
    } = this;

    const customStyles = {
      content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-40%',
        padding: '2px',
        transform: 'translate(-50%, -50%)',
      },
    };

    return (
      <div>
        <Wallet />
        <div className="aiwa-home-page-dashboard-container">
          <Animated.div style={{ overflow: 'hidden', width: this.state.dashboardWidth }}>
            <div className="aiwa-home-page-dashboard-token-details-transaction">
              <div className="aiwa-home-page">
                <TokenDetails showListOfTokens={this.showListOfTokens} />
                <Transactions />
              </div>
            </div>
          </Animated.div>
          <Animated.div
            style={{
              width: this.state.tokenListWidth,
            }}
          >
            <div className="aiwa-home-page-dashboard-token-list">
              <div
                className="tokens-class"
                onClick={this.handleHideTokenListContextMenu}
                onContextMenu={this.handleHideTokenListContextMenu}
              >
                <Tokens
                  tokenList={this.props.tokenList}
                  itemOnContextMenu={[
                    this.handleTokenListContextMenu,
                    this.handleHideTokenListContextMenu,
                  ]}
                  hideListOfTokens={this.hideListOfTokens}
                  contextMenu={this.state.contextMenu}
                />
              </div>
            </div>
          </Animated.div>
        </div>
        <div>
          <Modal
            isOpen={this.state.isOpen}
            contentLabel="Add Address"
            ariaHideApp={false}
            style={customStyles}
          >
            <div className="modal">
              <div className="close-window-icon" onClick={this.closeModal}>
                <IconWindowClose />
              </div>
              <div style={{ textAlign: 'center', paddingTop: 15 }}>
                <FontBold>Add this contact to your address book</FontBold>
                <FontRegular style={{ paddingTop: 5 }}>
                  {address !== undefined
                    && `${address.substring(0, 6)}...${address.substring(
                      address.length - 4,
                      address.length,
                    )}`}
                </FontRegular>
              </div>
              <div style={{ textAlign: 'center', paddingTop: 15 }}>
                <Input
                  name="alias"
                  value={alias}
                  onChange={this.handleOnChange}
                  style={{ height: 37 }}
                  placeholder="Contact's Name"
                />
              </div>
              <div style={{ textAlign: 'center', paddingTop: 15, paddingBottom: 15 }}>
                <ButtonLG
                  color="secondary"
                  onClick={this.addToAddressBook}
                  disabled={this.state.disabled}
                >
                  Add to Address Book
                </ButtonLG>
              </div>
            </div>
          </Modal>
        </div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    changePageStatus: newPage => dispatch(changePageStatus(newPage)),
    getCurrentWalletBalance: () => dispatch(getCurrentWalletBalance()),
    fetchAionCoinDetails: () => dispatch(fetchAionCoinDetails()),
    changeSelectedToken: selectedToken => dispatch(changeSelectedToken(selectedToken)),
    initializeWallet: () => dispatch(initializeWallet()),
    fetchTokenListBalance: () => dispatch(fetchTokenListBalance()),
    addContactToAddressBook: (address, alias, addressBook) => dispatch(addContactToAddressBook(address, alias, addressBook)),
    updateAddressDialog: item => dispatch(updateAddressDialog(item)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Home);
