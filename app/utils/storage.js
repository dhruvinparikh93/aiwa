import { getLocalStorage, setLocalStorage, sendMessage } from '../services/browserService';
import { ONBOARDING_PAGES_GROUP } from '../constants/navigation';

const CryptoJS = require('crypto-js');

const STORAGE_KEY = 'aiwa_config';
let hashKey;

export async function getHashKeyFromProcess() {
  const response = await sendMessage({ result: 'getKey' });
  if (response !== undefined) {
    hashKey = response.data;
  }
}

export function setHashKey(_hashKey) {
  hashKey = _hashKey;
}

function encryptState(state) {
  if (hashKey === undefined) {
    return;
  }
  const recipher = CryptoJS.AES.encrypt(JSON.stringify(state), hashKey);
  return recipher;
}

export async function decryptState(state) {
  if (hashKey === undefined) {
    await getHashKeyFromProcess();
    if (hashKey === undefined) {
      return;
    }
  }
  try {
    const cipher = state;
    const bytes = CryptoJS.AES.decrypt(cipher, hashKey);
    const plaintext = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(plaintext);
  } catch (err) {
    throw err;
  }
}

async function saveState(state) {
  if (hashKey === undefined) {
    await getHashKeyFromProcess();
  }
  const encyptedState = encryptState(state);
  if (encyptedState !== '' && encyptedState !== undefined) {
    setLocalStorage('state', encyptedState.toString());
  }
}

function updateDAppState(state) {
  const {
    wallets: { currentWallet },
    networks: {
      currentNetwork: { networkFullUrl },
    },
    appState: { pageStatus },
    security: { privacyModeEnabled, whiteListedDApp },
  } = state;
  let address = [];
  if (ONBOARDING_PAGES_GROUP.indexOf(pageStatus) === -1) {
    address = currentWallet ? [currentWallet.address] : [];
  }
  //Store local storage for state persistence
  setLocalStorage(
    STORAGE_KEY,
    JSON.stringify({
      currentNetwork: networkFullUrl,
      currentWallet: address,
      privacyModeEnabled,
      pageStatus,
      whiteListedDApp,
    }),
  );
  // update selected account address
  sendMessage({
    result: 'current_wallet',
    data: address,
  });
  // updated selected network
  sendMessage({
    result: 'current_network',
    data: networkFullUrl,
  });
}

export default function () {
  return next => (reducer, initialState) => {
    const store = next(reducer, initialState);

    store.subscribe(() => {
      const state = store.getState();
      saveState(state);
      updateDAppState(state);
    });
    return store;
  };
}

export async function getStore() {
  const decState = await getLocalStorage('state');
  const state = await decryptState(decState.state);
  const initialState = state === undefined ? {} : state;
  const { getStore } = require('../store/configureStore');
  return getStore(initialState);
}

export async function getStoreBackgroundJS() {
  const decState = await getLocalStorage('state');
  const state = await decryptState(decState.state);
  const initialState = state === undefined ? {} : state;
  const { getStoreBackgroundJS } = require('../store/configureStore');
  return getStoreBackgroundJS(initialState);
}
