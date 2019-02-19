export const CHANGE_CURRENT_ACCOUNT = 'CHANGE_CURRENT_ACCOUNT';
export const UPDATE_ACCOUNT_LIST = 'UPDATE_ACCOUNT_LIST';

export function updateAccountList(_accounts) {
  return {
    type: UPDATE_ACCOUNT_LIST,
    payload: _accounts,
  };
}

export function changeCurrentAccount(_account) {
  return {
    type: CHANGE_CURRENT_ACCOUNT,
    payload: _account,
  };
}
