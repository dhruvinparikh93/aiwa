import React, { Component } from 'react';

//Import Libraries
import { connect } from 'react-redux';
import validatorJs from 'validator';

//Import Actions
import { changePageStatus } from '../../constants/common';
import { sendTransaction } from '../../actions/transaction';

//Import common Components
import ButtonLG from '../Common/Buttons/ButtonLG';
import ButtonMD from '../Common/Buttons/ButtonMD';
import Footer from '../Common/Footer';
import SubHeader from '../Common/SubHeader';
import ConfirmView from '../Common/ConfirmView';

//Import constants
import { SEND_TRANSACTION_PAGE, HOME_PAGE } from '../../constants/navigation';
import { WINDOW, POPUP } from '../../constants/environment';
import { createToast } from '../../constants/toast';

//Import styles
import './styles.css';
//Import Services
import { removeLocalStorage, sendMessage } from '../../services/browserService';

// Import Validation Object and rules
import AiwaValidator from '../../utils/AiwaValidator';
import validator from '../../utils/AiwaValidator/validator';
import { getSendConfirmScreenDisplayItems } from '../../services/transactionService';
import config from '../../app.config';
import AddTokenPrompt from '../Common/AddTokenPrompt';

function mapStateToProps(state) {
  return {
    pageStatus: state.appState.pageStatus,
    currentWallet: state.wallets.currentWallet,
    currentWalletBalance: state.wallets.currentWalletBalance,
    transactionDetails: state.transactions.transactionDetails,
    currentNetwork: state.networks.currentNetwork,
    selectedToken: state.tokens.selectedToken,
    tokenList: state.tokens.tokenList,
    suggestAddToken: state.tokens.suggestAddToken,
    toastOptions: state.toast.toastOptions,
  };
}

class SendConfirm extends Component {
  constructor(props) {
    super(props);
    const { selectedToken } = this.props;
    // Declare Validator as well as Wallet variables
    this.validator = new AiwaValidator(validator.sendTokenFromDAppValidation);
    const aionCoin = this.props.tokenList[this.props.currentWallet.address][
      this.props.currentNetwork.value
    ][config.aionCoinIndex];
    this.state = {
      selectedToken,
      aionCoin,
    };
  }

  confirm = async () => {
    const { transactionDetails } = this.props;
    try {
      await this.props.sendTransaction(transactionDetails);
    } catch (error) {
      this.props.createToast({
        message: 'Transaction unable to submit. Try increasing gas',
        type: 'error',
      });
    }
  };

  cancel = async e => {
    const { changePageStatus } = this.props;
    await removeLocalStorage(['popupContent']);
    changePageStatus(HOME_PAGE);
    await sendMessage({
      result: 'cancel-send',
      data: { message: 'The user cancelled sending transaction' },
    });
    e.preventDefault();
  };

  handleSubheaderBackBtn = e => {
    if (this.props.transactionDetails.dApp) {
      this.cancel(e);
    } else {
      this.props.changePageStatus(SEND_TRANSACTION_PAGE);
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
      balanceAmount: this.props.transactionDetails.from.balance,
      selectedToken: this.props.transactionDetails.selectedToken,
      nrgLimit,
      aionCoin,
      totalNrg: this.props.transactionDetails.nrg.total,
    });
    return (
      <div>
        <AddTokenPrompt SendTransaction={SendTransaction} tokenName={name} />
        {window.AIWA_UI_TYPE === POPUP && (
          <SubHeader title={`Send ${name}`} backBtnOnClick={this.handleSubheaderBackBtn} />
        )}
        <ConfirmView
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
              onClick={this.confirm}
              disabled={!validation.isValid || validatorJs.isEmpty(value)}
            >
              Send
            </ButtonLG>
          )}
          {window.AIWA_UI_TYPE === WINDOW && (
            <div className="send-confirm-button-container">
              <div className="send-confirm-button-cancel">
                <ButtonMD color="primary" onClick={this.cancel}>
                  Cancel
                </ButtonMD>
              </div>
              <div className="send-confirm-button-send">
                <ButtonMD
                  color="secondary"
                  onClick={this.confirm}
                  disabled={!validation.isValid || validatorJs.isEmpty(value)}
                >
                  Send
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
    sendTransaction: transactionDetails => dispatch(sendTransaction(transactionDetails)),
    createToast: toastOptions => dispatch(createToast(toastOptions)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SendConfirm);
