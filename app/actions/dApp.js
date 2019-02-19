import { getLocalStorage } from '../services/browserService';
import { inputTransactionDetails } from '../constants/transactions';
import { signMessageDetails } from '../constants/message';
import { updateLoading, changePageStatus } from '../constants/common';
import {
  SIGN_TRANSACTION_PAGE,
  SIGN_MESSAGE_PAGE,
  CONFIRM_PAGE,
  CONNECT_REQUEST_PAGE,
} from '../constants/navigation';
import { connectRequestDetails, updateDAppList, updatePrivacyMode } from '../constants/security';
import { createTransactionObj } from '../services/transactionService';
import { createToast } from '../constants/toast';
import { changeSelectedToken } from '../constants/tokens';

const DAPP_STORAGE_KEY = 'popupContent';

export function handleDAppRequest() {
  return async (dispatch, getState) => {
    const { popupContent } = await getLocalStorage(DAPP_STORAGE_KEY);
    if (popupContent) {
      // Set Aion as selected Token for Dapp Interaction
      const { currentNetwork } = getState().networks;
      const { currentWallet } = getState().wallets;
      const { tokenList, selectedToken } = getState().tokens;
      const initialSelectedToken = tokenList[currentWallet.address][currentNetwork.value][0];
      if (selectedToken.name !== 'Aion') {
        dispatch(changeSelectedToken(initialSelectedToken));
      }

      const popupContentInJSON = JSON.parse(popupContent);
      let sendTransactionObj = {};
      switch (popupContentInJSON.func) {
        case 'eth_signTransaction':
          sendTransactionObj = await createTransactionObj(popupContentInJSON.args);
          sendTransactionObj.dApp = {
            url: popupContentInJSON.info.url,
            favIconUrl: popupContentInJSON.info.favIconUrl,
          };
          // Pass on Reducer State
          dispatch(inputTransactionDetails(sendTransactionObj));
          dispatch(changePageStatus(SIGN_TRANSACTION_PAGE));
          break;
        case 'eth_sendTransaction':
          sendTransactionObj = await createTransactionObj(popupContentInJSON.args);
          sendTransactionObj.dApp = {
            url: popupContentInJSON.info.url,
            favIconUrl: popupContentInJSON.info.favIconUrl,
          };
          // Pass on Reducer State
          dispatch(inputTransactionDetails(sendTransactionObj));
          dispatch(changePageStatus(CONFIRM_PAGE));
          break;
        case 'eth_sign':
          popupContentInJSON.dApp = {
            url: popupContentInJSON.info.url,
            favIconUrl: popupContentInJSON.info.favIconUrl,
          };
          // Pass on Reducer State
          dispatch(signMessageDetails(popupContentInJSON));
          dispatch(changePageStatus(SIGN_MESSAGE_PAGE));
          break;
        case 'privacy':
          dispatch(connectRequestDetails(popupContentInJSON.info));
          dispatch(changePageStatus(CONNECT_REQUEST_PAGE));
          break;
        default:
      }
    }
  };
}

export function AddWhiteListedDApp(origin) {
  return async (dispatch, getState) => {
    const { whiteListedDApp } = getState().security;
    try {
      whiteListedDApp.push(origin);
      dispatch(updateDAppList(whiteListedDApp));
      dispatch(updateLoading(false));
    } catch (err) {
      dispatch(updateLoading(false));
      throw err;
    }
  };
}

export function togglePrivacyMode() {
  return async (dispatch, getState) => {
    const { privacyModeEnabled } = getState().security;
    const status = privacyModeEnabled ? 'disabled' : 'enabled';
    dispatch(updatePrivacyMode(!privacyModeEnabled));
    dispatch(
      createToast({
        message: `You have ${status} privacy mode.`,
        type: 'info',
      }),
    );
  };
}
