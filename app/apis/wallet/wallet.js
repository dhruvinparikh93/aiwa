import AionWallet from './aionwallet';

export default class Wallet {
  //we can use it in future if we have multiple crypto currency
  //currentWalletType = config.currentWalletType;

  currentWallet = null;

  /**
   *
   * @param {String} privateKey
   */
  constructor(_privateKey) {
    this.currentWallet = new AionWallet(_privateKey);
  }

  /**
   * returns wallet's public address
   */
  getCurrentAddress() {
    return new Promise(resolve => {
      resolve(this.currentWallet.getCurrentAddress());
    });
  }

  /**
   * returns private key, for dev only
   */
  getPrivateKey() {
    return new Promise(resolve => {
      resolve(this.currentWallet.getPrivateKey());
    });
  }

  getBalance(_networkFullUrl, _format = 'number') {
    return new Promise(resolve => {
      resolve(this.currentWallet.getBalance(_networkFullUrl, _format));
    });
  }

  getUSDValue(_val) {
    return new Promise(resolve => {
      resolve(this.currentWallet.getUSDValue(_val));
    });
  }

  getGasLimit(_transaction) {
    return new Promise(resolve => {
      resolve(this.currentWallet.getGasLimit(_transaction));
    });
  }

  getGasPrice() {
    return new Promise(resolve => {
      resolve(this.currentWallet.getGasPrice());
    });
  }

  getNonce() {
    return new Promise(resolve => {
      resolve(this.currentWallet.getNonce());
    });
  }

  async signTransaction(_txn) {
    const response = await this.currentWallet.signTransaction(_txn);
    return response;
  }

  sign(data) {
    return new Promise(resolve => {
      resolve(this.currentWallet.sign(data));
    });
  }

  toV3(_password) {
    return new Promise((resolve, reject) => {
      this.currentWallet
        .toV3(_password)
        .then(data => {
          resolve(data);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  getV3Filename() {
    return new Promise((resolve, reject) => {
      this.currentWallet
        .getV3Filename()
        .then(data => {
          resolve(data);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  static fromV3(_input, _password) {
    return new Promise((resolve, reject) => {
      try {
        resolve(AionWallet.fromV3(_input, _password));
      } catch (err) {
        reject(err);
      }
    });
  }

  // this for web3-eth-accounts
  static decrypt(_input, _password) {
    return new Promise((resolve, reject) => {
      try {
        resolve(AionWallet.decrypt(_input, _password));
      } catch (err) {
        reject(err);
      }
    });
  }

  async sendTransaction(_txn) {
    const response = await this.currentWallet.sendTransaction(_txn);
    return response;
  }

  getWallet() {
    return new Promise((resolve, reject) => {
      try {
        resolve(this.currentWallet.wallet);
      } catch (err) {
        reject(err);
      }
    });
  }
}
