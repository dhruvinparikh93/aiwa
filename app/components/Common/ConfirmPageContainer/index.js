import React, { Component } from 'react';

//Import Libraries
import { connect } from 'react-redux';

//Import Actions
import { changePageStatus } from '../../../constants/common';
import { sendTransaction } from '../../../actions/transaction';

//Import common Components
import SubHeader from '../SubHeader';
import ConfirmView from '../ConfirmView';

//Import constants
import { POPUP } from '../../../constants/environment';
import { createToast } from '../../../constants/toast';

// Import Validation Object and rules
import AddTokenPrompt from '../AddTokenPrompt';

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

class ConfirmPageContainer extends Component {
  render() {
    const {
      SendTransaction,
      fromAlias,
      from,
      toAlias,
      to,
      value,
      name,
      symbol,
      ccyValue,
      ccy,
      validation,
      selectedToken,
      nrgType,
      nrgPrice,
      nrgLimit,
      hexData,
      handleSubheaderBackBtn,
    } = this.props;
    return (
      <div>
        <AddTokenPrompt SendTransaction={SendTransaction} tokenName={name} />
        {window.AIWA_UI_TYPE === POPUP && (
          <SubHeader title={`Send ${name}`} backBtnOnClick={handleSubheaderBackBtn} />
        )}
        <ConfirmView
          SendTransaction={SendTransaction}
          fromAlias={fromAlias}
          from={from}
          toAlias={toAlias}
          to={to}
          value={value}
          symbol={symbol}
          ccyValue={ccyValue}
          ccy={ccy}
          validation={validation}
          selectedToken={selectedToken}
          nrgType={nrgType}
          nrgPrice={nrgPrice}
          nrgLimit={nrgLimit}
          hexData={hexData}
        />
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
)(ConfirmPageContainer);
