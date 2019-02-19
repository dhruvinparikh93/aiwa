export const CONNECT_REQUEST_DETAILS = 'CONNECT_REQUEST_DETAILS';
export const TOGGLE_PRIVACY_MODE = 'TOGGLE_PRIVACY_MODE';
export const ADD_WHITE_LISTED_DAPP = 'ADD_WHITE_LISTED_DAPP';

export function connectRequestDetails(_data) {
  return {
    type: CONNECT_REQUEST_DETAILS,
    payload: _data,
  };
}

export function updatePrivacyMode(_status) {
  return {
    type: TOGGLE_PRIVACY_MODE,
    payload: _status,
  };
}
export function updateDAppList(_origin) {
  return {
    type: ADD_WHITE_LISTED_DAPP,
    payload: _origin,
  };
}
