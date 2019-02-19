import Web3 from 'aion-web3';
import BigNumber from 'bignumber.js';
import Wallet from '../wallet/wallet';
import { getStore } from '../../utils/storage';

let web3 = new Web3();

export default class Transaction {
  privateKey;

  wallet;

  transaction;

  constructor(_privateKey) {
    this.privateKey = _privateKey;
    this.wallet = new Wallet(this.privateKey);
  }

  async sendTransaction(_transaction) {
    const response = await this.wallet.getNonce();
    const transaction = {
      to: _transaction.to,
      data: _transaction.data || '',
      gasPrice: _transaction.gasPrice,
      gas: _transaction.gasLimit,
      value: new BigNumber(_transaction.amount).times(1e18),
      nonce: response.result,
      timestamp: Date.now() * 1000,
    };
    const txHash = await this.wallet.sendTransaction(transaction);
    return txHash;
  }

  async signTransaction(_transaction) {
    const response = await this.wallet.getNonce();
    const transaction = {
      to: _transaction.to,
      data: _transaction.data || '',
      gasPrice: _transaction.gasPrice,
      gas: _transaction.gasLimit,
      value: new BigNumber(_transaction.amount).times(1e18),
      nonce: response.result,
      timestamp: Date.now() * 1000,
    };
    const txHash = await this.wallet.signTransaction(transaction);
    return txHash;
  }

  getTransactionCount() {
    return new Promise(resolve => {
      const transactionCountPromise = this.wallet.getTransactionCount();
      transactionCountPromise.then(transactionCount => {
        resolve(transactionCount);
      });
    });
  }

  async getTransactionReceipt(trxHash) {
    const store = await getStore();
    const res = await this.getTransactionReceiptWithNetwork(
      trxHash,
      store.getState().networks.currentNetwork.networkFullUrl,
    );
    return res;
  }

  async getTransactionReceiptWithNetwork(trxHash, network) {
    web3 = new Web3(new Web3.providers.HttpProvider(network));

    const txReceipt = web3.eth.getTransactionReceipt(trxHash);

    if (txReceipt) {
      const tx = web3.eth.getTransaction(trxHash);
      return { txReceipt, tx };
    }
  }
}
