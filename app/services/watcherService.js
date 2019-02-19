import axios from 'axios';
import HttpStatus from 'http-status-codes';

import { getStore } from '../utils/storage';
import { updateNetworkConnection } from '../constants/common';

import { updateTransactionsAndCount } from '../actions/transaction';
import { getCurrentWalletBalance, getVaultBalance } from '../actions/wallet';
import { fetchTokenListBalance } from '../actions/tokens';

export async function verifyConnection(url, address) {
  let connection = '';
  if (!navigator.onLine) {
    connection = { statusCode: 0, flag: false };
    return connection;
  }
  const body = {
    jsonrpc: '2.0',
    id: 3,
    method: 'eth_getBalance',
    params: [address, 'latest'],
  };

  try {
    const response = await axios.post(url, body, { timeout: 3000 });
    connection = {
      statusCode: response.status,
      flag: response.status >= 200 && response.status < 300,
    };
    return connection;
  } catch (error) {
    let code = -1;
    if (error.response) {
      code = HttpStatus.INTERNAL_SERVER_ERROR;
    } else if (error.code && error.code === 'ECONNABORTED') {
      code = HttpStatus.REQUEST_TIMEOUT;
    } else {
      code = HttpStatus.UNAUTHORIZED;
    }
    connection = { statusCode: code, flag: false };
    return connection;
  }
}

export async function checkConnectivity() {
  const store = await getStore();
  const walletAddress = store.getState().wallets.currentWallet === undefined
    ? undefined
    : store.getState().wallets.currentWallet.address;
  const networkURL = store.getState().networks.currentNetwork === undefined
    ? undefined
    : store.getState().networks.currentNetwork.networkFullUrl;
  if (networkURL !== undefined && walletAddress !== undefined) {
    const connection = await verifyConnection(networkURL, walletAddress);
    store.dispatch(updateNetworkConnection(connection));
  }
}

export function updateApplicationState(store) {
  setInterval(async () => {
    try {
      updateTransactionsAndCount(undefined);
    } catch (error) {
      // eslint-disable-next-line
      console.log('Could not update transactions from interval', error);
    }
    try {
      store.dispatch(getCurrentWalletBalance());
      store.dispatch(getVaultBalance());
      store.dispatch(fetchTokenListBalance());
    } catch (error) {
      // eslint-disable-next-line
      console.log('Could not dispatch current wallet balance from interval', error);
    }
    try {
      checkConnectivity();
    } catch (error) {
      // eslint-disable-next-line
      console.log('Could not check connectivity from interval', error);
      throw error;
    }
  }, 10000);
}
