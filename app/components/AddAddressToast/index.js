import React, { Component } from 'react';

// Import Libraries
import { connect } from 'react-redux';
import { IconSuccess } from '../Common/Icon';
import ButtonLG from '../Common/Buttons/ButtonLG';
import { updateAddressDialog } from '../../constants/vaults';
import { shortenAddress } from '../../services/walletService';

const mapStateToProps = state => ({
  currentNetwork: state.networks.currentNetwork,
});

class AddAddressToast extends Component {
  constructor(props) {
    super(props);

    this.state = {
      address: props.address,
    };
  }

  openAddressDialog = () => {
    const {
      state: { address },
      props: { updateAddressDialog },
    } = this;
    const item = { isOpen: true, address };
    updateAddressDialog(item);
  };

  render() {
    const {
      state: { address },
    } = this;
    return (
      <div style={{ fontFamily: 'Roboto-Regular' }}>
        <IconSuccess />
        <span
          style={{
            fontSize: '16px',
            color: '#FFFFFF',
            paddingTop: 5,
            paddingLeft: 5,
          }}
        >
          Success
        </span>
        <div style={{ fontSize: '14px', color: '#FFFFFF', paddingTop: 3 }}>
          Your transaction was sent to
          {` ${shortenAddress(address)}`}
        </div>
        <div style={{ textAlign: 'center', paddingTop: 10, paddingBottom: 15 }}>
          <ButtonLG
            color="primary"
            style={{ width: 330, fontSize: '14px', fontWeight: 'bold' }}
            onClick={() => this.openAddressDialog()}
          >
            Add this address to your address book
          </ButtonLG>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  updateAddressDialog: item => dispatch(updateAddressDialog(item)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AddAddressToast);
