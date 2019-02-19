import {
  CHANGE_PAGE_STATUS,
  UPDATE_TOKEN,
  UPDATE_TERMS,
  UPDATE_TIMEOUT,
  CHECK_ACCEPTED_TOU_VERSION,
  MARKET_DATA,
  SEND_TOKEN_STATE,
  NETWORK_CONNECTION_UPDATE,
  ISLOADING,
} from '../constants/common';

const initialState = {
  pageStatus: 'sigin',
  token: undefined,
  isTermsAgree: undefined,
  isUpdatedTouVersion: false,
  timeout: 300000, // in miliseconds, default to 5 mins
  marketData: undefined,
  sendTokenSavedState: {},
  isNetworkConnected: true,
  statusCode: 200,
  isLoading: false,
};

const appState = (state = initialState, action) => {
  switch (action.type) {
    case CHANGE_PAGE_STATUS:
      return { ...state, pageStatus: action.payload };
    case UPDATE_TOKEN:
      return { ...state, token: action.payload };
    case UPDATE_TERMS:
      return { ...state, isTermsAgree: action.payload };
    case UPDATE_TIMEOUT:
      return { ...state, timeout: action.payload };
    case CHECK_ACCEPTED_TOU_VERSION:
      return { ...state, isUpdatedTouVersion: action.payload };
    case MARKET_DATA:
      return { ...state, marketData: action.payload };
    case ISLOADING:
      return { ...state, isLoading: action.payload };
    case SEND_TOKEN_STATE:
      return { ...state, sendTokenSavedState: action.payload };
    case NETWORK_CONNECTION_UPDATE:
      return {
        ...state,
        isNetworkConnected: action.payload.flag,
        statusCode: action.payload.statusCode,
      };
    default:
      return state;
  }
};

export default appState;
