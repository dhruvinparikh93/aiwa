import { CHANGE_CURRENT_ACCOUNT, UPDATE_ACCOUNT_LIST } from '../constants/accounts';

const initialState = {
  currentAccount: undefined, // stores account user is viewing
  accounts: [], // list of accounts that user can switch to
};

const accounts = (state = initialState, action) => {
  switch (action.type) {
    case CHANGE_CURRENT_ACCOUNT:
      return { ...state, currentAccount: action.payload };
    case UPDATE_ACCOUNT_LIST:
      return { ...state, accounts: action.payload };
    default:
      return state;
  }
};

export default accounts;
