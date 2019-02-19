import React, { Component } from 'react';

// Import Libraries
import { connect } from 'react-redux';
import validatorJs from 'validator';

// Import common Components
import SubHeader from '../Common/SubHeader';
import ButtonLG from '../Common/Buttons/ButtonLG';
import AddTokenForm from '../Common/AddTokenForm';

// Import actions and services
import { fetchTokenData } from '../../services/tokenService';
import { changePageStatus } from '../../constants/common';
import { addTokenToList } from '../../actions/tokens';
import { fetchMarketData } from '../../actions/home';
import { getCurrentWalletBalance } from '../../actions/wallet';
import { createToast } from '../../constants/toast';

// Import Validation Object and rules
import AiwaValidator from '../../utils/AiwaValidator';
import validator from '../../utils/AiwaValidator/validator';

//Import Constants
import { HOME_PAGE } from '../../constants/navigation';

const mapStateToProps = state => ({
  currentNetwork: state.networks.currentNetwork,
});

class AddToken extends Component {
  constructor(props) {
    super(props);

    // Declare Validator
    this.validator = new AiwaValidator(validator.addTokenValidation);

    this.state = {
      address: '',
      name: '',
      symbol: '',
      decimals: '',
      id: '',
      pageErrorMessage: false,
    };
  }

  handleSubheaderBackBtn = () => {
    this.props.changePageStatus(HOME_PAGE);
  };

  handleOnChange = event => {
    const { value } = event.target;

    // Declare Token Obj
    let token;

    try {
      token = fetchTokenData(value, this.props.currentNetwork.networkFullUrl);
    } catch (error) {
      // If Error, throw error
      token = {
        name: '',
        symbol: '',
        decimals: '',
        id: '',
      };
    }

    // Deconstruct token
    const {
      name, id, symbol, decimals
    } = token;

    // Set State
    this.setState({
      address: value,
      name,
      symbol,
      decimals,
      id,
    });
  };

  handleSumbit = async () => {
    // Validate Fields
    const validation = this.validator.validate(this.state);

    // Return if Validation is incorrect
    if (!validation.isValid) return;

    // Fetch Market Data for token first
    await this.props.fetchMarketData(this.state.id);

    // Add Token to list
    const tokenAdded = await this.props.addTokenToList(this.state.address);
    const pageErrorMessage = !tokenAdded;

    // Set State
    this.setState({ validation, pageErrorMessage });

    // Navigate To Home
    if (tokenAdded) this.props.changePageStatus(HOME_PAGE);
  };

  render() {
    const {
      address, name, symbol, decimals, pageErrorMessage
    } = this.state;

    // Validate Everytime User Enters
    const validation = this.validator.validate(this.state);

    return (
      <div>
        <SubHeader title="Add Token" backBtnOnClick={this.handleSubheaderBackBtn} />
        <AddTokenForm
          title="Add a token to your current wallet."
          address={address}
          onChange={this.handleOnChange}
          error={validation.address.isInvalid}
          validationAddressMessage={validation.address.message}
          name={name}
          symbol={symbol}
          decimals={decimals}
          pageErrorMessage={pageErrorMessage}
          canEditContractAddress
        >
          <ButtonLG
            color="secondary"
            onClick={this.handleSumbit}
            disabled={!validation.isValid || validatorJs.isEmpty(address) || pageErrorMessage}
          >
            Submit
          </ButtonLG>
        </AddTokenForm>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  changePageStatus: newPage => dispatch(changePageStatus(newPage)),
  addTokenToList: contractAddress => dispatch(addTokenToList(contractAddress)),
  fetchMarketData: (tokenID, provider) => dispatch(fetchMarketData(tokenID, provider)),
  getCurrentWalletBalance: () => dispatch(getCurrentWalletBalance()),
  createToast: toastOptions => dispatch(createToast(toastOptions)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AddToken);
