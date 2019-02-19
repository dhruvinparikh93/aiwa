//import { setLocalStorage } from '../services/browserService';

export const SEND_TRANSCATION = 'SEND_TRANSCATION';
export const UPDATE_TRANSACTION_LIST = 'UPDATE_TRANSACTION_LIST';
export const UPDATE_TRANSACTION_COUNT = 'UPDATE_TRANSACTION_COUNT';
export const SIGN_TRANSACTION = 'SIGN_TRANSACTION';
export const UPDATE_LAST_TRANSACTION = 'UPDATE_LAST_TRANSACTION';
export const UPDATE_PENDING_TRANSACTION = 'UPDATE_PENDING_TRANSACTION';
export const INPUT_TRANSACTION_DETAILS = 'INPUT_TRANSACTION_DETAILS';
export const UPDATE_NRG_PRICE = 'UPDATE_NRG_PRICE';
export const UPDATE_NRG_LIMIT = 'UPDATE_NRG_LIMIT';

export function inputTransactionDetails(data) {
  return {
    type: INPUT_TRANSACTION_DETAILS,
    payload: data,
  };
}

export function updateTransactionList(data) {
  //  setLocalStorage('transactions', _transactions);
  return {
    type: UPDATE_TRANSACTION_LIST,
    payload: data,
  };
}

export function sendTransaction(data) {
  return {
    type: SEND_TRANSCATION,
    payload: data,
  };
}

export function updateTransactionCount(data) {
  return {
    type: UPDATE_TRANSACTION_COUNT,
    payload: data,
  };
}

export function signTransaction(data) {
  return {
    type: SIGN_TRANSACTION,
    payload: data,
  };
}

export function updateLastTransaction(data) {
  return {
    type: UPDATE_LAST_TRANSACTION,
    payload: data,
  };
}

export function updatePendingTransactions(_transactions) {
  return {
    type: UPDATE_PENDING_TRANSACTION,
    payload: _transactions,
  };
}

export function updateNrgPrice(_gasPrice) {
  return {
    type: UPDATE_NRG_PRICE,
    payload: _gasPrice,
  };
}

export function updateNrgLimit(_nrgLimit) {
  return {
    type: UPDATE_NRG_LIMIT,
    payload: _nrgLimit,
  };
}
