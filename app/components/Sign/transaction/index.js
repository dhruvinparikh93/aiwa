import React, { Component } from 'react';

//Import Libraries
import { connect } from 'react-redux';
import validatorJs from 'validator';

//Import Actions
import { changePageStatus } from '../../../constants/common';
import { signTransaction } from '../../../actions/transaction';

//Import common Components
import ButtonLG from '../../Common/Buttons/ButtonLG';
import ButtonMD from '../../Common/Buttons/ButtonMD';
import Footer from '../../Common/Footer';

//Import constants
import { HOME_PAGE } from '../../../constants/navigation';
import { WINDOW, POPUP } from '../../../constants/environment';
import { createToast } from '../../../constants/toast';

//Import styles
import './styles.css';
//Import Services
import { removeLocalStorage, sendMessage } from '../../../services/browserService';

// Import Validation Object and rules
import AiwaValidator from '../../../utils/AiwaValidator';
import validator from '../../../utils/AiwaValidator/validator';
import { getSendConfirmScreenDisplayItems } from '../../../services/transactionService';
import ConfirmPageContainer from '../../Common/ConfirmPageContainer';

function mapStateToProps(state) {
  return {
    pageStatus: state.appState.pageStatus,
    currentWallet: state.wallets.currentWallet,
    transactionDetails: state.transactions.transactionDetails,
    currentNetwork: state.networks.currentNetwork,
    selectedToken: state.tokens.selectedToken,
    tokenList: state.tokens.tokenList,
    suggestAddToken: state.tokens.suggestAddToken,
  };
}

class SignTransaction extends Component {
  constructor(props) {
    super(props);
    const { selectedToken } = this.props;
    // Declare Validator as well as Wallet variables
    this.validator = new AiwaValidator(validator.sendTokenFromDAppValidation);
    const aionCoin = this.props.tokenList[this.props.currentWallet.address][
      this.props.currentNetwork.value
    ][0];
    this.state = {
      selectedToken,
      aionCoin,
    };
  }

  sign = async () => {
    const { transactionDetails } = this.props;

    try {
      await this.props.signTransaction(transactionDetails);
    } catch (error) {
      this.props.createToast({
        message: 'Unable to sign transaction',
        type: 'error',
      });
    }
  };

  cancel = async e => {
    const { changePageStatus } = this.props;
    await removeLocalStorage(['popupContent']);
    changePageStatus(HOME_PAGE);
    await sendMessage({
      result: 'cancel-sign',
      data: { message: 'The user cancelled signing transaction' },
    });
    e.preventDefault();
  };

  handleSubheaderBackBtn = e => {
    if (this.props.transactionDetails.dApp) {
      this.cancel(e);
    } else {
      this.props.changePageStatus(HOME_PAGE);
    }
  };

  shortenURL(url) {
    if (url.length > 29) {
      return `${url.substring(0, 29)}...`;
    }
    return url;
  }

  render() {
    const SendTransaction = this.props.transactionDetails;
    const {
      fromAlias,
      from,
      toAlias,
      to,
      value,
      token: { name, symbol },
      ccyValue,
      ccy,
      nrgType,
      nrgPrice,
      nrgLimit,
      hexData,
    } = getSendConfirmScreenDisplayItems(this.props.transactionDetails);
    const { selectedToken, aionCoin } = this.state;
    const validation = this.validator.validate({
      amount: value,
      balanceAmount: this.props.transactionDetails.selectedToken.balance.amount,
      selectedToken: this.props.transactionDetails.selectedToken,
      nrgLimit,
      aionCoin,
      totalNrg: this.props.transactionDetails.nrg.total,
    });
    return (
      <div>
        <ConfirmPageContainer
          SendTransaction={SendTransaction}
          fromAlias={fromAlias}
          from={from}
          toAlias={toAlias}
          to={to}
          value={value}
          name={name}
          symbol={symbol}
          ccyValue={ccyValue}
          ccy={ccy}
          validation={validation}
          selectedToken={selectedToken}
          nrgType={nrgType}
          nrgPrice={nrgPrice}
          nrgLimit={nrgLimit}
          hexData={hexData}
          handleSubheaderBackBtn={this.handleSubheaderBackBtn}
        />
        <Footer>
          {window.AIWA_UI_TYPE === POPUP && (
            <ButtonLG
              color="secondary"
              onClick={this.sign}
              disabled={!validation.isValid || validatorJs.isEmpty(value)}
            >
              Sign
            </ButtonLG>
          )}
          {window.AIWA_UI_TYPE === WINDOW && (
            <div className="sign-transaction-button-container">
              <div className="sign-transaction-button-cancel">
                <ButtonMD color="primary" onClick={this.cancel}>
                  Cancel
                </ButtonMD>
              </div>
              <div className="sign-transaction-button-send">
                <ButtonMD
                  color="secondary"
                  onClick={this.sign}
                  disabled={!validation.isValid || validatorJs.isEmpty(value)}
                >
                  Sign
                </ButtonMD>
              </div>
            </div>
          )}
        </Footer>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    changePageStatus: newPage => dispatch(changePageStatus(newPage)),
    signTransaction: transactionDetails => dispatch(signTransaction(transactionDetails)),
    createToast: toastOptions => dispatch(createToast(toastOptions)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SignTransaction);
