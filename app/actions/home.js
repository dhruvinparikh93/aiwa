// Import Libraries
import axios from 'axios';
import HttpStatus from 'http-status-codes';
import { getLocalStorage } from '../services/browserService';
import Config from '../app.config';

// Import Constants
import { checkAcceptedTouVersion, updateLoading, updateMarketData } from '../constants/common';
import { updateTokenList, changeSelectedToken } from '../constants/tokens';
// eslint-disable-next-line import/no-cycle
import { fetchTransactionList } from './transaction';

// Import Services
import { toFormat } from '../services/numberFormatter';
import { fetchTokenBalance } from '../services/tokenService';
import { AION_NETWORK_LIST } from '../constants/networks';
import { getVaultBalance } from './wallet';

export function verifyAcceptedTouVersion() {
  return async dispatch => {
    const localTou = await getLocalStorage('touVersion');
    const localTouVersion = localTou.touVersion;

    const buildTouVersion = Config.touVersion;

    if (parseInt(buildTouVersion, 10) !== parseInt(localTouVersion, 10)) {
      dispatch(checkAcceptedTouVersion(true));
    } else {
      dispatch(checkAcceptedTouVersion(false));
    }
  };
}

export function fetchMarketData(tokenId) {
  return async (dispatch, getState) => {
    // Declaring Market Data API URL
    const url = `${Config.marketDataApiUrl}api/v3/coins/${tokenId}`;

    // Get reducer state variable
    const { marketData } = getState().appState;

    try {
      if (tokenId === undefined) {
        throw Error('Token Id Must be define for fetch data');
      }

      // Fetch Data
      try {
        const response = await axios.get(url);

        if (response.status !== HttpStatus.OK) {
          throw Error(response.statusText);
        }

        const currentTokenMarketData = response.data.market_data;
        // Extract necessary information from market data
        const tempMarketData = {
          ...marketData,
          [tokenId]: {
            marketData: {
              currentPrice: toFormat(currentTokenMarketData.current_price.usd),
              marketCap: toFormat(currentTokenMarketData.market_cap.usd),
              priceChangePercentage24h: toFormat(
                currentTokenMarketData.price_change_percentage_24h,
              ),
              totalVolume: toFormat(currentTokenMarketData.total_volume.usd),
              circulatingSupply: toFormat(currentTokenMarketData.circulating_supply),
            },
          },
        };
        dispatch(updateMarketData(tempMarketData));
      } catch (err) {
        const tempMarketData = {
          ...marketData,
          [tokenId]: {
            marketData: {
              error: 'Could not find coin with the given id',
            },
          },
        };
        dispatch(updateMarketData(tempMarketData));
      }
    } catch (e) {
      const tempMarketData = {
        error: 'Token id must be defined.',
      };
      dispatch(updateMarketData(tempMarketData));
    }
  };
}

export function fetchAionCoinDetails() {
  return async (dispatch, getState) => {
    // Get Variables from reducer state
    const { tokenList } = getState().tokens;
    const { currentNetwork } = getState().networks;
    const { wallets } = getState().wallets;
    const { marketData } = getState().appState;

    let walletListObj = {};
    wallets.forEach(wallet => {
      const walletNetworkObj = {};
      AION_NETWORK_LIST.forEach(network => {
        walletNetworkObj[network.value] = tokenList[wallet.address] !== undefined ? tokenList[wallet.address][network.value] : [];
      });

      walletListObj = {
        [wallet.address]: {
          ...walletNetworkObj,
        },
        ...walletListObj,
      };
    });

    let tempTokenList = tokenList;
    await Promise.all(
      wallets.map(async wallet => {
        tempTokenList = Object.prototype.hasOwnProperty.call(tokenList, wallet.address)
          ? tempTokenList
          : {
            ...tempTokenList,
            ...walletListObj,
          };

        // Declare Variables
        const currentWalletTokenListArr = tempTokenList[wallet.address][currentNetwork.value];
        const currentWalletAionTokenIndex = currentWalletTokenListArr.findIndex(
          token => token.id === 'aion',
        );

        if (currentWalletAionTokenIndex !== -1) {
          return;
        }

        // Get aion token Balance
        const aionAmount = await fetchTokenBalance(wallet, 'none', currentNetwork.networkFullUrl);
        const {
          marketData: { currentPrice },
        } = marketData.aion;

        const aionToken = {
          id: 'aion',
          name: 'Aion',
          symbol: 'AION',
          decimals: 18,
          address: 'none',
          balance: {
            amount: aionAmount,
            usd: Number(currentPrice) * Number(aionAmount),
          },
        };

        // Declare Variables
        let walletTokenListArr = tempTokenList[wallet.address][currentNetwork.value];

        // Get Token Index
        const tokenIndex = walletTokenListArr.findIndex(token => token.id === 'aion');

        // If Aion already exists in list, return
        if (tokenIndex === -1) {
          // Push Aion to Array
          walletTokenListArr = [aionToken, ...walletTokenListArr];
        }

        // Add Array to wallet within the current network
        tempTokenList[wallet.address][currentNetwork.value] = walletTokenListArr;
      }),
    );
    dispatch(updateTokenList(tempTokenList));
  };
}

export function initializeWallet() {
  return async (dispatch, getState) => {
    try {
      dispatch(fetchMarketData('aion'));
      dispatch(fetchAionCoinDetails());

      const { tokenList, selectedToken } = getState().tokens;
      const { currentNetwork } = getState().networks;
      const { currentWallet } = getState().wallets;

      const initialSelectedToken = tokenList[currentWallet.address][currentNetwork.value][0];
      if (selectedToken === undefined) {
        dispatch(changeSelectedToken(initialSelectedToken));
      } else if (
        tokenList[currentWallet.address][currentNetwork.value].findIndex(
          token => token.address === selectedToken.address,
        ) === -1
      ) {
        dispatch(changeSelectedToken(initialSelectedToken));
      }
      dispatch(updateLoading(false));
      dispatch(fetchTransactionList());

      // Fetch Updated Balance
    } catch (err) {
      dispatch(updateLoading(false));
      throw err;
    }
  };
}

export function loadWallet() {
  return async dispatch => {
    dispatch(updateLoading(true));
    await dispatch(fetchMarketData('aion'));
    await dispatch(fetchAionCoinDetails());
    await dispatch(getVaultBalance());
    dispatch(updateLoading(false));
  };
}
