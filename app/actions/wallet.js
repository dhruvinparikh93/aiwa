import { createWallet } from '../services/vaultService';
import { fetchWalletBalance, fetchVaultBalance } from '../constants/wallets';
import { fetchTokenBalance } from '../services/tokenService';
import { changeSelectedToken } from '../constants/tokens';

export function getVaultBalance() {
  return async (dispatch, getState) => {
    // Declare Variable
    const { wallets } = getState().wallets;
    let { selectedToken } = getState().tokens;
    const { tokenList } = getState().tokens;
    const { marketData } = getState().appState;
    const { currentNetwork } = getState().networks;

    const initialSelectedToken = tokenList[wallets[0].address][currentNetwork.value][0];
    if (!selectedToken) {
      dispatch(changeSelectedToken(initialSelectedToken));
      selectedToken = initialSelectedToken;
    }

    // Get Balance
    const walletBalanceObjArr = [];

    await Promise.all(
      wallets.map(async wallet => {
        if (wallet.privateKey !== undefined) {
          // Get AION token
          const aionToken = tokenList[wallet.address][currentNetwork.value][0];

          // Get Token  Balance and USD Value
          const amount = await fetchTokenBalance(
            wallet,
            selectedToken.address,
            currentNetwork.networkFullUrl,
          );

          const aionAmount = await fetchTokenBalance(wallet, 'none', currentNetwork.networkFullUrl);
          const aionCurrentPrice = marketData.aion.marketData.currentPrice;

          let aionUsd;
          if (aionCurrentPrice !== undefined) {
            aionUsd = Number(aionCurrentPrice) * Number(aionAmount);
          }

          const aionBalance = {
            amount: aionAmount,
            usd: aionUsd,
          };

          const {
            marketData: { currentPrice },
          } = marketData[selectedToken.id];

          let usd;
          if (currentPrice !== undefined) usd = Number(currentPrice) * Number(amount);

          const walletBalanceObj = {
            wallet,
            selectedToken: {
              ...selectedToken,
              balance: {
                amount,
                usd,
              },
            },
            aionToken: {
              ...aionToken,
              balance: {
                ...aionBalance,
              },
            },
          };

          walletBalanceObjArr.push(walletBalanceObj);
        }
      }),
    );

    dispatch(fetchVaultBalance(walletBalanceObjArr));
  };
}

export function getCurrentWalletBalance() {
  return async (dispatch, getState) => {
    // Declare Variable
    const { currentWallet } = getState().wallets;
    const { selectedToken } = getState().tokens;
    const { marketData } = getState().appState;
    const { currentNetwork } = getState().networks;

    // Return if the current wallet or selected token has not been set yet.
    if (!currentWallet || !selectedToken) {
      dispatch(fetchWalletBalance({}));
      return;
    }

    // Get Token  Balance and USD Value
    const amount = await fetchTokenBalance(
      currentWallet,
      selectedToken.address,
      currentNetwork.networkFullUrl,
    );
    const {
      marketData: { currentPrice },
    } = marketData[selectedToken.id];

    let usd = 0;
    if (currentPrice !== undefined) usd = Number(currentPrice) * Number(amount);

    const walletBalanceObj = {
      wallet: currentWallet,
      selectedToken: {
        ...selectedToken,
        balance: {
          amount,
          usd,
        },
      },
    };
    dispatch(fetchWalletBalance(walletBalanceObj));
  };
}

export async function createWalletAction(hashKey) {
  return createWallet(hashKey, 'SeedWordsBased', { useSeedWords: true });
}
