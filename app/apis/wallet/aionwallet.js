import Web3 from 'aion-web3';
import { BigNumber } from 'bignumber.js';
import Web3EthAccounts from 'aion-web3-eth-accounts';
import Accounts from 'aion-keystore';
import axios from 'axios';
import { getStore } from '../../utils/storage';

let web3 = new Web3();
const account = new Accounts();
const web3Account = new Web3EthAccounts();
export default class AionWallet {
  privateKey = null;

  wallet = null;

  constructor(_privateKey) {
    if (_privateKey !== '' && _privateKey !== undefined) {
      this.wallet = account.privateKeyToAccount(_privateKey);
      this.wallet.privateKey = `${this.wallet.privateKey}`;
      this.wallet.address = `${this.wallet.address}`;
    } else if (_privateKey !== undefined) {
      this.wallet = account.create();
    }
  }

  /**
   * returns wallet's public address
   */
  getCurrentAddress() {
    return this.wallet.address;
  }

  /**
   * returns private key, for dev only
   */
  getPrivateKey() {
    return this.wallet.privateKey;
  }

  getBalance(_networkFullUrl, _format) {
    web3 = new Web3(new Web3.providers.HttpProvider(_networkFullUrl));
    if (_format) {
      return new Promise((resolve, reject) => {
        try {
          resolve(web3.eth.getBalance(this.wallet.address) / 10e17);
        } catch (error) {
          reject(error);
        }
      });
    }
  }

  // get USD values from coin market cap
  // https://api.coinmarketcap.com/v2/ticker/2062/?convert=USD
  // 2062 is ticker id for AION
  // return (no of aions * usd value)

  getUSDValue(_val) {
    this.val = _val;
    let usdVal;
    return new Promise(resolve => {
      axios.get('https://api.coinmarketcap.com/v2/ticker/2062/?convert=USD').then(response => {
        usdVal = response.data.data.quotes.USD.price;
        resolve((usdVal * Number(this.val)).toFixed(2));
      });
    });
  }

  async getGasLimit(_transaction) {
    this.transaction = _transaction;
    const store = await getStore();
    web3 = new Web3(
      new Web3.providers.HttpProvider(store.getState().networks.currentNetwork.networkFullUrl),
    );
    // {data: data, from: sender, to: receiver, value: amount}
    return new Promise(resolve => {
      const txInfo = {
        from: this.getCurrentAddress(),
        to: this.transaction.to,
        value: this.transaction.amount ? new BigNumber(this.transaction.amount).times('1e18') : 0,
        data: this.transaction.data,
      };
      const estimate = web3.eth.estimateGas(txInfo);
      resolve(estimate);
    });
  }

  async getGasPrice() {
    this.price = 0;
    const store = await getStore();
    web3 = new Web3(
      new Web3.providers.HttpProvider(store.getState().networks.currentNetwork.networkFullUrl),
    );
    return new Promise(resolve => {
      this.price = web3.eth.gasPrice;
      resolve(this.price);
    });
  }

  async getNonce() {
    const body = {
      jsonrpc: '2.0',
      method: 'eth_getTransactionCount',
      params: [this.wallet.address, 'pending'],
      id: 1,
    };
    const store = await getStore();
    const provider = store.getState().networks.currentNetwork.networkFullUrl;

    return new Promise(resolve => {
      axios.post(provider, body).then(response => {
        resolve(response.data);
      });
    });
  }

  async sendTransaction(_txData) {
    this.txData = _txData;
    const store = await getStore();
    web3 = new Web3(
      new Web3.providers.HttpProvider(store.getState().networks.currentNetwork.networkFullUrl),
    );
    try {
      const result = await this.signTransaction(this.txData);
      const response = await web3.eth.sendRawTransaction(result.rawTransaction);
      return response;
    } catch (error) {
      throw error;
    }
  }

  signTransaction(_txData) {
    this.txData = _txData;
    return new Promise((resolve, reject) => {
      this.wallet
        .signTransaction(this.txData)
        .then(signed => {
          resolve(signed);
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  sign(_data) {
    this.data = _data;
    return new Promise(resolve => {
      resolve(this.wallet.sign(this.data));
    });
  }

  toV3(_password) {
    return new Promise((resolve, reject) => {
      try {
        const encodedFile = this.wallet.encryptToRlp(_password);
        resolve(encodedFile);
      } catch (err) {
        reject(err);
      }
    });
  }

  getV3Filename() {
    return new Promise((resolve, reject) => {
      try {
        resolve(
          `UTC--${new Date().toJSON().replace(/:/g, '-')}--${this.wallet.address.replace(
            '0x',
            '',
          )}`,
        );
      } catch (err) {
        reject(err);
      }
    });
  }

  static fromV3(_input, _password) {
    return new Promise((resolve, reject) => {
      try {
        resolve(account.decryptFromRlp(_input, _password));
      } catch (err) {
        reject(err);
      }
    });
  }

  static decrypt(_input, _password) {
    return new Promise((resolve, reject) => {
      try {
        resolve(web3Account.decrypt(_input, _password));
      } catch (err) {
        reject(err);
      }
    });
  }
}
