import Web3 from 'aion-web3';
import BigNumber from 'bignumber.js';
import Wallet from '../apis/wallet/wallet';
import { convertAionToNanoAmp, convertBNToString, convertNanoAmpToAion } from './numberFormatter';

// Import Constants
import { CONTRACT_ABI, TRANSFER, SEND } from '../constants/tokens';

export function fetchTokenData(contractAddress, provider) {
  const web3 = new Web3(new Web3.providers.HttpProvider(provider));
  // Initialize Token Contract
  const tokenContract = web3.eth.contract(CONTRACT_ABI).at(contractAddress);
  // Get Values
  const tokenName = tokenContract.name();
  const id = tokenName.toLowerCase();
  const symbol = tokenContract.symbol();
  const decimals = tokenContract.decimals().toString();
  const granularity = tokenContract.granularity().toString();
  // Initialize Object
  const token = {
    id,
    name: tokenName,
    symbol,
    decimals,
    granularity,
    address: contractAddress,
  };
  return token;
}

export async function fetchTokenBalance(wallet, contractAddress, provider) {
  const web3 = new Web3(new Web3.providers.HttpProvider(provider));

  let amount = 0.0;

  // Aion has 'none' as contract address.
  if (contractAddress === 'none') {
    amount = await new Wallet(wallet.privateKey).getBalance(provider);
  } else {
    const tokenContract = web3.eth.contract(CONTRACT_ABI).at(contractAddress);
    amount = tokenContract.balanceOf(wallet.address);
    amount = convertBNToString(amount, 0);
    amount = convertNanoAmpToAion(amount);
  }

  return amount;
}

export async function getNrgLimit(to, amount, data, selectedToken, privateKey, provider) {
  // Declare Variables
  let nrgLimit;
  const account = new Wallet(privateKey);
  const web3 = new Web3(new Web3.providers.HttpProvider(provider));
  const convertAmount = convertAionToNanoAmp(amount);
  const sendAmount = convertBNToString(convertAmount, 0);

  // Declare Contract Instance
  const tokenContract = web3.eth.contract(CONTRACT_ABI).at(selectedToken.address);

  if (selectedToken.address === 'none') {
    nrgLimit = await account.getGasLimit({
      to,
      amount,
      data,
    });
  } else if (selectedToken.address !== 'none') {
    if (data === undefined || data === '') {
      nrgLimit = await tokenContract.transfer.estimateGas(to, sendAmount, {
        from: account.currentWallet.wallet.address,
      });
    } else {
      nrgLimit = await tokenContract.send.estimateGas(to, sendAmount, data, {
        from: account.currentWallet.wallet.address,
      });
    }
  }

  return nrgLimit;
}

export async function sendToken(
  sendTokenTransaction,
  contractAddress,
  privateKey,
  provider,
  send = true,
) {
  // Declare Variables
  const {
    from, to, amount, hexData, gasPrice, gas
  } = sendTokenTransaction;
  const web3 = new Web3(new Web3.providers.HttpProvider(provider));
  const convertAmount = convertAionToNanoAmp(amount);
  const sendAmount = convertBNToString(convertAmount, 0);

  // Declare Account and get Nonce
  const account = new Wallet(privateKey);
  const nonce = web3.eth.getTransactionCount(from);

  // Declare Contract Instance
  const tokenContract = web3.eth.contract(CONTRACT_ABI).at(contractAddress);

  // Get Contract Data
  const methodData = hexData === undefined
    ? tokenContract.transfer.getData(to, sendAmount)
    : tokenContract.send.getData(to, sendAmount, hexData);

  // Declare Transaction
  const transaction = {
    to: contractAddress,
    nonce,
    gasPrice,
    gas,
    data: methodData,
    timestamp: Date.now() * 1000,
  };

  // Sign Transaction
  const signedTransaction = await account.signTransaction(transaction);
  if (!send) {
    return signedTransaction;
  }

  // Send Transaction
  const transactionHash = await web3.eth.sendRawTransaction(signedTransaction.rawTransaction);

  return transactionHash;
}

export function decodeERC777MethodData(data) {
  const methodID = data ? data.substring(0, 10) : undefined;
  let tempData;
  let hexDataLength;
  switch (methodID) {
    case TRANSFER:
      return {
        to: `0x${data.substring(10, 74)}`,
        value: new BigNumber(`0x${data.substring(74)}`),
        data: undefined,
      };
    case SEND:
      hexDataLength = parseInt(`0x${data.substring(138, 170).toString()}`, 16) * 2;
      tempData = `0x${data.substring(170, 170 + hexDataLength).toString()}`;
      return {
        to: `0x${data.substring(10, 74)}`,
        value: new BigNumber(`0x${data.substring(74, 106)}`),
        data: tempData,
      };
    default:
      return {
        to: undefined,
        value: new BigNumber('0'),
        data: undefined,
      };
  }
}

export function isContract(address, provider) {
  const web3 = new Web3(new Web3.providers.HttpProvider(provider));
  const code = web3.eth.getCode(address);
  return code !== '0x';
}

export async function getNrgPrice(privateKey) {
  const account = new Wallet(privateKey);
  const gasPrice = await account.getGasPrice();
  return gasPrice;
}

export function isTokenFound(tokens, tokenToLookup) {
  const tokenFound = tokens.find(token => token.address === tokenToLookup.address);
  return tokenFound !== undefined;
}
