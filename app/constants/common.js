import { removeAllLocalAppStorage } from '../services/browserService';

export const CHANGE_PAGE_STATUS = 'CHANGE_PAGE_STATUS';
export const UPDATE_TOKEN = 'UPDATE_TOKEN';
export const UPDATE_TERMS = 'UPDATE_TERMS';
export const UPDATE_TIMEOUT = 'UPDATE_TIMEOUT';
export const CHECK_ACCEPTED_TOU_VERSION = 'CHECK_ACCEPTED_TOU_VERSION';
export const MARKET_DATA = 'MARKET_DATA';
export const SEND_TOKEN_STATE = 'SEND_TOKEN_STATE';
export const NETWORK_CONNECTION_UPDATE = 'NETWORK_CONNECTION_UPDATE';
export const USER_IS_VALID = 'USER_IS_VALID';
export const ISLOADING = 'ISLOADING';

export const STORAGE_KEYS = [
  'exportPK',
  'importWallet',
  'createKeyStoreFile',
  'settings',
  'exportVault',
];

export function changePageStatus(_newPage) {
  removeAllLocalAppStorage(STORAGE_KEYS);
  return {
    type: CHANGE_PAGE_STATUS,
    payload: _newPage,
  };
}

export function updateToken(_token) {
  return {
    type: UPDATE_TOKEN,
    payload: _token,
  };
}

export function updateTerms(_isAgree) {
  return {
    type: UPDATE_TERMS,
    payload: _isAgree,
  };
}

export function checkAcceptedTouVersion(_checkAcceptedTouVersion) {
  return {
    type: CHECK_ACCEPTED_TOU_VERSION,
    payload: _checkAcceptedTouVersion,
  };
}

export function updateTimeout(_period) {
  return {
    type: UPDATE_TIMEOUT,
    payload: _period,
  };
}

export function updateMarketData(_marketData) {
  return {
    type: MARKET_DATA,
    payload: _marketData,
  };
}

export function saveSendTokenState(data) {
  return {
    type: SEND_TOKEN_STATE,
    payload: data,
  };
}

export function validate(val) {
  // true means invalid, so our conditions got reversed
  if (val !== undefined) {
    return {
      val: val.length === 0,
    };
  }
}

export function updateNetworkConnection(connection) {
  return {
    type: NETWORK_CONNECTION_UPDATE,
    payload: connection,
  };
}

export function updateLoading(flag) {
  return {
    type: ISLOADING,
    payload: flag,
  };
}
