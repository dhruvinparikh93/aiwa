// 0xa02210f678afce1cc5ce2eb57b5c6c12186742f71094761d7fbeea38dd3b0495

// Import Services
import { fetchTokenData, fetchTokenBalance } from '../services/tokenService';

// Import Constants
import { updateTokenList } from '../constants/tokens';
import { createToast } from '../constants/toast';

function getInitialValues(contractAddress, getState) {
  const { tokenList } = getState().tokens;
  const { currentNetwork } = getState().networks;
  const { currentWallet } = getState().wallets;
  // Declare Token List Array
  const tokenListArr = tokenList[currentWallet.address][currentNetwork.value];

  // Get Token Index
  const tokenIndex = tokenListArr.findIndex(token => token.address === contractAddress);

  return {
    tokenListArr,
    tokenIndex,
    extraProps: {
      currentNetwork,
      currentWallet,
      tokenList,
    },
  };
}

export function addTokenToList(contractAddress) {
  return async (dispatch, getState) => {
    const { marketData } = getState().appState;
    const {
      tokenListArr,
      tokenIndex,
      extraProps: { currentNetwork, currentWallet, tokenList },
    } = getInitialValues(contractAddress, getState);

    if (tokenIndex !== -1) {
      dispatch(
        createToast({
          message: 'Could not add Token. Token already exists within wallet.',
          type: 'warning',
        }),
      );
      return false;
    }

    // Get Token object and Balance and USD Value
    const token = fetchTokenData(contractAddress, currentNetwork.networkFullUrl);
    // Get Token  Balance and USD Value
    const amount = await fetchTokenBalance(
      currentWallet,
      contractAddress,
      currentNetwork.networkFullUrl,
    );

    let usd;

    const tokenMarketData = marketData[token.id].marketData;
    const { error } = tokenMarketData;

    if (!error) {
      const { currentPrice } = tokenMarketData;

      if (currentPrice !== undefined) usd = Number(currentPrice) * Number(amount);
    }
    const tokenObj = {
      ...token,
      balance: {
        amount,
        usd,
      },
    };

    // Push Token to Array
    tokenListArr.push(tokenObj);

    // Construct new token list
    const tempTokenList = {
      ...tokenList,
      [currentWallet.address]: {
        [currentNetwork.value]: tokenListArr,
        ...tokenList[currentWallet.address],
      },
    };

    // Dispatch
    await Promise.all([
      dispatch(updateTokenList(tempTokenList)),
      dispatch(
        createToast({
          message: `${token.name} token successfully added.`,
          type: 'success',
        }),
      ),
    ]);
    return true;
  };
}

export function removeTokenFromList(contractAddress) {
  return async (dispatch, getState) => {
    // Get Variables from reducer state
    const {
      tokenListArr,
      tokenIndex,
      extraProps: { currentNetwork, currentWallet, tokenList },
    } = getInitialValues(contractAddress, getState);
    const token = tokenListArr[tokenIndex];

    if (tokenIndex === -1) {
      return false;
    }

    // Remove Token From Array
    tokenListArr.splice(tokenIndex, 1);

    // Construct new token list
    const tempTokenList = {
      ...tokenList,
      [currentWallet.address]: {
        [currentNetwork.value]: tokenListArr,
        ...tokenList[currentWallet.address],
      },
    };

    // Dispatch
    await Promise.all([
      dispatch(updateTokenList(tempTokenList)),
      dispatch(
        createToast({
          message: `${token.name} Token successfully removed.`,
          type: 'success',
        }),
      ),
    ]);
    return true;
  };
}

export function fetchTokenListBalance() {
  return async (dispatch, getState) => {
    // Get Variables from reducer state
    const { tokenList } = getState().tokens;
    const { currentNetwork } = getState().networks;
    const { currentWallet } = getState().wallets;
    const { marketData } = getState().appState;

    // Declare Token List Array
    const tokenListArr = tokenList[currentWallet.address][currentNetwork.value];

    const currentTokenListArr = [];

    await Promise.all(
      tokenListArr.map(async token => {
        // Get Token  Balance and USD Value
        const amount = await fetchTokenBalance(
          currentWallet,
          token.address,
          currentNetwork.networkFullUrl,
        );

        let usd;

        const tokenMarketData = marketData[token.id].marketData;
        const { error } = tokenMarketData;

        if (!error) {
          const { currentPrice } = tokenMarketData;

          if (currentPrice !== undefined) usd = Number(currentPrice) * Number(amount);
        }
        const tokenObj = {
          ...token,
          balance: {
            amount,
            usd,
          },
        };

        currentTokenListArr.unshift(tokenObj);
      }),
    );

    // Save Updated Balance to Current Wallet Tokens
    const tempTokenList = tokenList;
    tempTokenList[currentWallet.address][currentNetwork.value] = currentTokenListArr;

    dispatch(updateTokenList({ ...tempTokenList }));
  };
}
