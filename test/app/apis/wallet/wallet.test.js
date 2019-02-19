import sinon from 'sinon';
import { readFileSync } from 'fs';
import * as Storage from '../../../../app/utils/storage';
import * as apisMocks from '../apis.mocks';
import Wallet from '../../../../app/apis/wallet/wallet';
import AionWallet from '../../../../app/apis/wallet/aionwallet';

const assert = require('assert');

const walletObj = new Wallet(apisMocks.privateKey);
describe('api/Wallet/wallet', () => {
  describe('#constructore', () => {
    it('Create a Wallet base on privateKey', () => {
      // eslint-disable-next-line prefer-destructuring
      const wallet = walletObj.currentWallet.wallet;
      assert(
        wallet.publicKey === '0xa75d1c6e59833fad80ba02cc8010c4a99787a0859941613a7ccadf9c51c15c3a',
        'Public Key should be match',
      );
    });
  });

  describe('getCurrentAddress', () => {
    it('Get Public key of current Wallet', async () => {
      const aionStub = sinon
        .stub(AionWallet.prototype, 'getCurrentAddress')
        .returns('0xa0130e8bef33916c224f8b45b32bff5ffc5ccff1b875cf7606fdcb620aa9e0f0');

      const address = await walletObj.getCurrentAddress();
      assert(
        address === '0xa0130e8bef33916c224f8b45b32bff5ffc5ccff1b875cf7606fdcb620aa9e0f0',
        'address should be match',
      );
      aionStub.restore();
    });
  });

  describe('getPrivateKey', () => {
    it('Get the Public Address of current Wallet', async () => {
      const output = await walletObj.getPrivateKey();
      assert(output === apisMocks.privateKey, 'PrivateKey should be match');
    });
  });

  describe('getBalance', () => {
    it('Get the Balance of current Wallet', async () => {
      const aionStub = sinon.stub(AionWallet.prototype, 'getBalance').returns(3.4);
      const balance = await walletObj.getBalance();
      assert(balance === 3.4, 'Balance should be match');
      aionStub.restore();
    });
  });

  describe('getUSDValue', () => {
    it('Get the USD Value of current Wallet', async () => {
      const aionStub = sinon.stub(AionWallet.prototype, 'getUSDValue').returns(0.29);
      const price = await walletObj.getUSDValue();
      assert(price === 0.29, 'Balance should be match');
      aionStub.restore();
    });
  });

  describe('getGasLimit', () => {
    it('Get the GasLimit', async () => {
      const aionStub = sinon.stub(AionWallet.prototype, 'getGasLimit').returns(23200);
      const gaslimit = await walletObj.getGasLimit();
      assert(gaslimit === 23200, 'Balance should be match');
      aionStub.restore();
    });
  });

  describe('getGasPrice', () => {
    it('Get the GasPrice', async () => {
      const aionStub = sinon.stub(AionWallet.prototype, 'getGasPrice').returns(2.1);
      const gaslimit = await walletObj.getGasPrice();
      assert(gaslimit === 2.1, 'Balance should be match');
      aionStub.restore();
    });
  });

  describe('getNonce', () => {
    it('Get the Nonce', async () => {
      const store = sinon.stub(Storage, 'getStore').returns(apisMocks.mockStore);
      const aionStub = sinon.stub(AionWallet.prototype, 'getNonce').returns(2.1);
      const Nonce = await walletObj.getNonce();

      assert(Nonce === 2.1);
      store.restore();
      aionStub.restore();
    });
  });

  describe('signTransaction', () => {
    it('Get the Txn Hash', async () => {
      const store = sinon.stub(Storage, 'getStore').returns(apisMocks.mockStore);
      const signTransaction = await walletObj.signTransaction(apisMocks.transaction);
      assert(signTransaction !== undefined, 'SignTransaction should not be undefined');
      assert(signTransaction.messageHash !== undefined, 'MessageHash should not be undefined');
      assert(signTransaction.signature !== undefined, 'Signature should not be undefined');
      assert(
        signTransaction.rawTransaction !== undefined,
        'Raw Transaction should not be undefined',
      );
      store.restore();
    });
  });

  describe('sign', () => {
    it('Get the sign Data', async () => {
      const store = sinon.stub(Storage, 'getStore').returns(apisMocks.mockStore);

      const message = '0x123456';
      const aionStub = sinon.stub(AionWallet.prototype, 'sign').returns(apisMocks.mockSignData);
      const data = await walletObj.sign('0x123456');
      assert(data !== undefined);
      assert(data.message === message);
      assert(data.messageHash !== undefined);
      assert(data.signature !== undefined);
      store.restore();
      aionStub.restore();
    });
  });

  describe('toV3', () => {
    it('Encrypt Current Wallet', async () => {
      const encryptWallet = await walletObj.toV3(apisMocks.token);
      assert(encryptWallet !== undefined, 'Encrypt Current Wallet');
      assert(encryptWallet.length > 0, 'Encrypt Value of Wallet');
    });
  });

  describe('getV3Filename', () => {
    it('Filename follow naming rules', async () => {
      const fileName = await walletObj.getV3Filename();
      assert(
        fileName.includes('a0130e8bef33916c224f8b45b32bff5ffc5ccff1b875cf7606fdcb620aa9e0f0'),
        'filename contain address',
      );
    });
  });

  describe('fromV3', () => {
    it('Decrypt Current Wallet', async () => {
      const inputFile = readFileSync(
        'test/app/keystoreFile/UTC--2018-10-18T19-52-00.345Z--a0aa6d40d962ef60d6c42da54adec24f242de46f27d2ea3d96f0ccefa5678b62',
      );
      const aionStub = sinon.stub(AionWallet, 'fromV3').returns(apisMocks.wallet);
      const wallet = await Wallet.fromV3(inputFile, '1234');
      assert(
        wallet.privateKey
          === '0x336c5c68d75010d738f620fb21a04cc56234d76a7b5d9ca3088708f1c45b3161a75d1c6e59833fad80ba02cc8010c4a99787a0859941613a7ccadf9c51c15c3a',
        'Privatekey should be match',
      );
      assert(
        wallet.address === '0xa0aa6d40d962ef60d6c42da54adec24f242de46f27d2ea3d96f0ccefa5678b62',
      );
      aionStub.restore();
    });
  });
  describe('sendTransaction', () => {
    it('Sending Transaction should  work', async () => {
      const aionStub = sinon
        .stub(AionWallet.prototype, 'sendTransaction')
        .returns('0xff659f1f9c92169d2c0a6bfa9d6cce2bf8001167f8485c3c00efcd5b9ed7e3f9');
      const txnHash = await walletObj.sendTransaction(apisMocks.transaction);
      assert(txnHash !== undefined, 'Encrypt Current Wallet');
      assert(txnHash.length > 0, 'Encrypt Value of Wallet');

      aionStub.restore();
    });
  });
});

describe('getWallet', () => {
  it('Get the current Wallet', async () => {
    const wallet = await walletObj.getWallet();
    assert(
      wallet.publicKey === '0xa75d1c6e59833fad80ba02cc8010c4a99787a0859941613a7ccadf9c51c15c3a',
      'Public Key should be match',
    );
  });
});
