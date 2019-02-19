import React, { Component } from 'react';

//Import Libraries
import { connect } from 'react-redux';
import Modal from 'react-modal';

//Import Actions
import { updateAddTokenSuggestion } from '../../../constants/tokens';
import { addTokenToList } from '../../../actions/tokens';
import { fetchMarketData } from '../../../actions/home';

//Import common Components
import ButtonSM from '../Buttons/ButtonSM';
import AddTokenForm from '../AddTokenForm';
import { IconWindowClose } from '../Icon';

//Import styles
import './styles.css';

function mapStateToProps(state) {
  return {
    tokenList: state.tokens.tokenList,
    suggestAddToken: state.tokens.suggestAddToken,
    transactionDetails: state.transactions.transactionDetails,
  };
}

class AddTokenPrompt extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      oneTimeSuggestion: false,
    };
  }

  static getDerivedStateFromProps(prevProps, nextState) {
    const {
      transactionDetails: {
        erc777: { isERC777, isTokenSaved },
      },
    } = prevProps;
    let open = false;
    if (isERC777 && !isTokenSaved && !nextState.oneTimeSuggestion) {
      prevProps.updateAddTokenSuggestion(true);

      open = true;
    }
    return { open };
  }

  closeAddTokenSuggestionWindow = data => {
    this.props.updateAddTokenSuggestion(false);
    this.setState({
      open: !data,
      oneTimeSuggestion: data,
    });
  };

  closeModal = e => {
    this.closeAddTokenSuggestionWindow(true);
    e.preventDefault();
  };

  modalSubmit = async e => {
    const {
      transactionDetails: {
        selectedToken: { address, id },
      },
    } = this.props;
    this.closeAddTokenSuggestionWindow(true);
    // Fetch Market Data for token first
    await this.props.fetchMarketData(id);
    // Add Token to list
    await this.props.addTokenToList(address);
    e.preventDefault();
  };

  render() {
    const { SendTransaction, tokenName } = this.props;
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
      <Modal
        isOpen={this.state.open}
        contentLabel="Add token suggestion"
        style={customStyles}
        ariaHideApp={false}
      >
        <div className="close-window-icon" onClick={this.closeModal}>
          <IconWindowClose />
        </div>
        <AddTokenForm
          title={`Would you like to add ${tokenName} token?`}
          address={SendTransaction.selectedToken.address}
          onChange={() => {}}
          error={false}
          canEditContractAddress={false}
          validationAddressMessage=""
          name={tokenName}
          symbol={SendTransaction.selectedToken.symbol}
          decimals={SendTransaction.selectedToken.decimals}
          pageErrorMessage={false}
        >
          <div className="add-token-suggestion-button-container">
            <div className="add-token-suggestion-button-cancel">
              <ButtonSM color="primary" onClick={this.closeModal}>
                Cancel
              </ButtonSM>
            </div>
            <div className="add-token-suggestion-button-send">
              <ButtonSM color="secondary" onClick={this.modalSubmit}>
                Submit
              </ButtonSM>
            </div>
          </div>
        </AddTokenForm>
      </Modal>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    updateAddTokenSuggestion: isOpen => dispatch(updateAddTokenSuggestion(isOpen)),
    addTokenToList: contractAddress => dispatch(addTokenToList(contractAddress)),
    fetchMarketData: (tokenID, provider) => dispatch(fetchMarketData(tokenID, provider)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AddTokenPrompt);
