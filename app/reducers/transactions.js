import {
  UPDATE_TRANSACTION_COUNT,
  SEND_TRANSCATION,
  UPDATE_TRANSACTION_LIST,
  SIGN_TRANSACTION,
  UPDATE_LAST_TRANSACTION,
  UPDATE_PENDING_TRANSACTION,
  INPUT_TRANSACTION_DETAILS,
  UPDATE_NRG_PRICE,
  UPDATE_NRG_LIMIT,
} from '../constants/transactions';

const initialState = {
  transactions: undefined,
  transactionCount: undefined,
  transactionDetails: undefined,
  newtransaction: undefined,
  signTxInfo: undefined,
  preConfirmTrxCount: undefined,
  differenceTrx: undefined,
  lastUpdatedTrx: undefined,
  pendingTrxns: [],
  nrgPrice: {
    value: 0,
    nrgInUsd: {
      slow: 0,
      normal: 0,
      fast: 0,
    },
    nrgInAmp: {
      slow: 0,
      normal: 0,
      fast: 0,
    },
  },
  nrgLimit: 0,
};

/**
 * Example for transactionDetail Reducer
 *
transactionDetails = {
  selectedToken: {
    tokenName: '',
    contractAddress: '',
    decimals: ''
  },
  from: {
    address: '',
    name: '',
    balance: '',
    usdBalance: ''
  },
  to: { address: '', name: '' },
  hexdata: '',
  amount: { ccyValue: '', value: '', ccy: '' },
  nrg: {
    gasLimit: '',
    gasPrice: '',
    type: '',
    total: '',
    totalUSD: ''
  },
  transactionType: ''
}
 */

const transactions = (state = initialState, action) => {
  switch (action.type) {
    case INPUT_TRANSACTION_DETAILS:
      return {
        ...state,
        transactionDetails: action.payload,
      };
    case UPDATE_TRANSACTION_COUNT:
      return {
        ...state,
        preConfirmTrxCount: action.payload.preConfirmTrxCount,
        differenceTrx: action.payload.differenceTrx,
      };
    case UPDATE_TRANSACTION_LIST:
      return { ...state, transactions: action.payload };
    case SEND_TRANSCATION:
      return { ...state, newtransaction: action.payload };
    case SIGN_TRANSACTION:
      return { ...state, signTxInfo: action.payload };
    case UPDATE_LAST_TRANSACTION:
      return { ...state, lastUpdatedTrx: action.payload };
    case UPDATE_PENDING_TRANSACTION:
      return { ...state, pendingTrxns: action.payload };
    case UPDATE_NRG_PRICE:
      return { ...state, nrgPrice: action.payload };
    case UPDATE_NRG_LIMIT:
      return { ...state, nrgLimit: action.payload };
    default:
      return state;
  }
};

export default transactions;
