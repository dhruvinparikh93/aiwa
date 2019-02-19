import BigNumber from 'bignumber.js';
import { getStore } from '../utils/storage';
import { shortenAddress, getWalletAlias } from './walletService';

import {
  getNrgLimit,
  getNrgPrice,
  decodeERC777MethodData,
  fetchTokenData,
  fetchTokenBalance,
  isContract,
  isTokenFound,
} from './tokenService';
import NRG_MULTIPLIER from '../constants/nrg';
import { convertNanoAmpToAion, convertNanoAmpToAmp, convertValueToUSD } from './numberFormatter';

function verifyERC777Token(erc777token) {
  if (erc777token.symbol !== '' && erc777token.name !== '') {
    return true;
  }
  return false;
}

function bigNumberify(val) {
  if (val) {
    return new BigNumber(val);
  }
  return new BigNumber('0');
}

export function getToAlias(isERC777, wallets, modifiedTo, networkFullUrl, addressBook) {
  let toAlias;
  if (isERC777) {
    toAlias = getWalletAlias(wallets.wallets, modifiedTo);
  } else if (!isERC777) {
    if (modifiedTo) {
      if (!isContract(modifiedTo, networkFullUrl)) {
        toAlias = getWalletAlias(wallets.wallets, modifiedTo);
      } else {
        toAlias = 'Contract';
      }
    } else {
      toAlias = 'New Contract';
    }
  }
  if (toAlias === 'Unknown Contact') {
    toAlias = getWalletAlias(addressBook, modifiedTo);
  }
  return toAlias;
}

export async function createTransactionObj(tx) {
  const { getState } = await getStore();
  const {
    to, value, data, gas
  } = tx;
  let { selectedNrgType = 'normal', gasPrice } = tx;
  const { wallets } = getState();
  const { currentWallet } = getState().wallets;
  const {
    networks: {
      currentNetwork: { networkFullUrl, value: networkValue },
    },
  } = getState();
  const { selectedToken, tokenList } = getState().tokens;
  const { marketData } = getState().appState;
  const { addressBook } = getState().vaults;

  // Check if hex data is being passed in
  let validatedHexData = data === '' ? undefined : data;
  // Identify tokens or AIONs
  let amount;
  let erc777token;
  let erc777params;
  let isERC777;
  let isTokenSaved = false;
  let modifiedSelectedToken;
  let modifiedTo;
  modifiedTo = to;
  if (selectedToken.name === 'Aion') {
    erc777token = fetchTokenData(modifiedTo, networkFullUrl);
    erc777params = decodeERC777MethodData(validatedHexData);
    isERC777 = verifyERC777Token(erc777token);
    //modify the value if ERC777 parsed
    if (isERC777) {
      isTokenSaved = isTokenFound(tokenList[currentWallet.address][networkValue], erc777token);
      const tokenBalance = await fetchTokenBalance(currentWallet, modifiedTo, networkFullUrl);
      erc777token.balance = {};
      erc777token.balance.amount = tokenBalance;
      erc777token.balance.usd = undefined;
      amount = convertNanoAmpToAion(erc777params.value);
      modifiedTo = erc777params.to; //eslint-disable-line prefer-destructuring
      validatedHexData = erc777params.data;
    } else {
      amount = value ? convertNanoAmpToAion(value) : new BigNumber('0');
      erc777token.address = 'none';
    }
  } else {
    amount = bigNumberify(value);
    erc777token = selectedToken;
    erc777params = { to: modifiedTo, value: amount, data: data || undefined };
    isERC777 = true;
    isTokenSaved = true;
  }
  // Get Alias Name for To and set selectedToken
  const toAlias = getToAlias(isERC777, wallets, modifiedTo, networkFullUrl, addressBook);
  if (isERC777) {
    modifiedSelectedToken = erc777token;
  } else {
    modifiedSelectedToken = selectedToken;
  }
  // NRG Calculations
  const gasLimit = gas
    || (await getNrgLimit(
      modifiedTo,
      amount,
      validatedHexData,
      modifiedSelectedToken,
      currentWallet.privateKey,
      networkFullUrl,
    ));
  let calculatedGasPrice;
  if (gasPrice) {
    selectedNrgType = 'custom';
    calculatedGasPrice = new BigNumber(gasPrice);
  } else {
    gasPrice = await getNrgPrice(currentWallet.privateKey);
    calculatedGasPrice = gasPrice.multipliedBy(
      new BigNumber(NRG_MULTIPLIER[selectedNrgType.toUpperCase()]),
    );
  }
  const totalNrg = new BigNumber(gasLimit).multipliedBy(gasPrice);
  // calculate usd value
  let amountUsd;
  if (isTokenSaved) {
    const tokenMarketData = marketData[modifiedSelectedToken.id].marketData;
    const { error } = tokenMarketData;

    if (!error) {
      const { currentPrice } = tokenMarketData;
      if (currentPrice !== undefined) {
        amountUsd = convertValueToUSD(amount, currentPrice);
      }
    }
  }

  // Build Transaction object
  const transactionObj = {
    selectedToken: modifiedSelectedToken,
    from: {
      address: currentWallet.address,
      alias: currentWallet.alias,
      balance: isERC777
        ? erc777token.balance.amount
        : wallets.currentWalletBalance.selectedToken.balance.amount,
      usdBalance: isERC777 ? undefined : wallets.currentWalletBalance.selectedToken.balance.usd,
    },
    to: {
      address: modifiedTo || undefined,
      alias: toAlias,
    },
    hexData: validatedHexData,
    amount: {
      ccyValue: amountUsd,
      value: amount,
      ccy: 'USD',
    },
    nrg: {
      gasLimit,
      gasPrice: calculatedGasPrice,
      type: selectedNrgType,
      total: totalNrg,
      totalUSD: '-',
    },
    transactionType: 'SEND',
    erc777: {
      erc777token,
      erc777params,
      isERC777,
      isTokenSaved,
    },
  };
  return transactionObj;
}

function stringify(val) {
  return val.toString();
}

export function getSendConfirmScreenDisplayItems(transaction) {
  const fromAlias = transaction.from.alias;
  const from = shortenAddress(transaction.from.address);
  const toAlias = transaction.to.alias;
  let token;
  const nrgPrice = convertNanoAmpToAmp(transaction.nrg.gasPrice);
  const nrgLimit = transaction.nrg.gasLimit;
  const nrgType = `${transaction.nrg.type.charAt(0).toUpperCase() + transaction.nrg.type.slice(1)}`;
  const { ccyValue, ccy } = transaction.amount;
  let to;
  let value;
  let hexData;
  if (transaction.isERC777) {
    to = shortenAddress(transaction.erc777.erc777params.to);
    value = transaction.erc777.erc777params.value; //eslint-disable-line prefer-destructuring
    token = transaction.erc777.erc777token;
    hexData = transaction.erc777.erc777params.data || '';
  } else {
    to = transaction.to.address ? shortenAddress(transaction.to.address) : '';
    value = transaction.amount.value; //eslint-disable-line prefer-destructuring
    token = transaction.selectedToken;
    hexData = transaction.hexData || '';
  }

  const txForConfirmScreen = {
    fromAlias,
    from,
    toAlias,
    to,
    value: stringify(value),
    token,
    ccyValue,
    ccy,
    nrgType,
    nrgPrice,
    nrgLimit,
    hexData,
  };

  return txForConfirmScreen;
}

function fixTo(transaction) {
  if (transaction.to) {
    return `Sent to ${shortenAddress(transaction.to)}`;
  }
  if (transaction.tx && transaction.tx.to !== '0x') {
    if (transaction.tx.selectedToken.name !== 'Aion') {
      return `Sent to ${shortenAddress(decodeERC777MethodData(transaction.tx.input).to)}`;
    }
    return `Sent to ${shortenAddress(transaction.tx.to)}`;
  }
  return 'Contract Deployment';
}

function filterTransactionsBasedOnNetwork(transactions, networkURL) {
  return transactions
    ? transactions.filter(transaction => transaction.networkURL === networkURL)
    : undefined;
}

function getValue(transaction) {
  if (transaction.value) {
    return stringify(transaction.value);
  }
  return stringify(transaction.tx.value);
}

function getUSDValue(transaction) {
  if (transaction.USD) {
    return transaction.USD;
  }
  if (transaction.tx && transaction.tx.USD) {
    return transaction.tx.USD;
  }
  return '';
}

export function getTransactionDisplayList(transactions, currentNetwork) {
  if (!transactions) return undefined;
  const filteredTransactions = filterTransactionsBasedOnNetwork(
    transactions,
    currentNetwork.networkFullUrl,
  );
  if (!filteredTransactions) return undefined;
  filteredTransactions.forEach((transaction, index) => {
    filteredTransactions[index] = {
      hash: transaction.hash || transaction.tx.hash,
      confirmTimeStamp: transaction.confirmTimeStamp || transaction.tx.confirmTimeStamp,
      value: getValue(transaction),
      USD: getUSDValue(transaction),
      status: transaction.txReceipt ? transaction.txReceipt.status : '0x2',
      to: fixTo(transaction),
      selectedToken: transaction.selectedToken || transaction.tx.selectedToken,
      isClickable: !!currentNetwork.transactionUrl,
    };
  });
  return filteredTransactions;
}
