import sinon from 'sinon';
import * as actions from '../../../app/actions/vault';
import * as commonConstants from '../../../app/constants/common';
import * as walletConstants from '../../../app/constants/wallets';
import * as hydrateConstants from '../../../app/constants/hydrate';
import * as vaultService from '../../../app/services/vaultService';
import * as mocks from './mocks';

const assert = require('assert');

describe('Vault Action', () => {
  describe('setTimeout', () => {
    it('should dispatch UPDATE_TIMEOUT on success', async () => {
      const expectedActions = [
        {
          type: commonConstants.UPDATE_TIMEOUT,
          payload: 100000,
        },
      ];

      const store = global.mockStore({
        appState: {
          timeout: 300000,
        },
      });

      await store.dispatch(actions.setTimeout('100'));
      assert.equal(JSON.stringify(store.getActions()), JSON.stringify(expectedActions));
    });

    it('should dispatch UPDATE_TIMEOUT with proper time if inputted value is too small', async () => {
      const expectedActions = [
        {
          type: commonConstants.UPDATE_TIMEOUT,
          payload: 30000,
        },
      ];

      const store = global.mockStore({
        appState: {
          timeout: 300000,
        },
      });

      await store.dispatch(actions.setTimeout('10'));
      assert.equal(JSON.stringify(store.getActions()), JSON.stringify(expectedActions));
    });

    it('should dispatch UPDATE_TIMEOUT with proper time if inputted value is too big', async () => {
      const expectedActions = [
        {
          type: commonConstants.UPDATE_TIMEOUT,
          payload: 99999999000,
        },
      ];

      const store = global.mockStore({
        appState: {
          timeout: 300000,
        },
      });

      await store.dispatch(actions.setTimeout('-5'));
      assert.equal(JSON.stringify(store.getActions()), JSON.stringify(expectedActions));
    });
  });

  describe('importVault', () => {
    it('should dispatch UPDATE_WALLET_LIST, CHANGE_CURRENT_WALLET on successful import', async () => {
      const importStub = sinon
        .stub(vaultService, 'importVaultService')
        .returns(mocks.vaultImportSuccessfulResponse);

      const expectedActions = [
        {
          type: walletConstants.UPDATE_WALLET_LIST,
          payload: mocks.vaultImportSuccessfulResponse.wallets,
        },
        {
          type: walletConstants.CHANGE_CURRENT_WALLET,
          payload: {
            wallet: mocks.vaultImportSuccessfulResponse.currentWallet,
          },
        },
      ];

      const store = global.mockStore({});
      await store.dispatch(
        actions.importVault('inputFile', 'password', 'this-is-a-really-cool-hash-key'),
      );

      assert.equal(JSON.stringify(store.getActions()), JSON.stringify(expectedActions));
      importStub.restore();
    });

    it('should dispatch UPDATE_WALLET_LIST only, if currentWallet is undefined', async () => {
      const importStub = sinon
        .stub(vaultService, 'importVaultService')
        .returns(mocks.vaultImportWithoutCurrentWalletSuccessfulResponse);

      const expectedActions = [
        {
          type: walletConstants.UPDATE_WALLET_LIST,
          payload: mocks.vaultImportWithoutCurrentWalletSuccessfulResponse.wallets,
        },
      ];

      const store = global.mockStore({});
      await store.dispatch(
        actions.importVault('inputFile', 'password', 'this-is-a-really-cool-hash-key'),
      );

      assert.equal(JSON.stringify(store.getActions()), JSON.stringify(expectedActions));
      importStub.restore();
    });

    it('should dispatch UPDATE_WALLET_LIST, UPDATE_TOKEN if token is undefined', async () => {
      const importStub = sinon
        .stub(vaultService, 'importVaultService')
        .returns(mocks.vaultImportWithoutCurrentWalletSuccessfulResponse);

      const expectedActions = [
        {
          type: walletConstants.UPDATE_WALLET_LIST,
          payload: mocks.vaultImportWithoutCurrentWalletSuccessfulResponse.wallets,
        },
        {
          type: commonConstants.UPDATE_TOKEN,
          payload: mocks.vaultImportWithoutCurrentWalletSuccessfulResponse.hashKey,
        },
      ];

      const store = global.mockStore({});
      await store.dispatch(actions.importVault('inputFile', 'password', undefined));

      assert.equal(JSON.stringify(store.getActions()), JSON.stringify(expectedActions));
      importStub.restore();
    });
  });

  describe('signIn', () => {
    it('should dispatch HYDRATE_APP on successful signIn', async () => {
      const signInStub = sinon.stub(vaultService, 'signInService').returns({
        appState: {
          foo: 'bar',
        },
      });

      const expectedActions = [
        {
          type: hydrateConstants.HYDRATE_APP,
          payload: {
            appState: {
              foo: 'bar',
            },
          },
        },
      ];

      const store = global.mockStore({});
      await store.dispatch(actions.signIn('password'));

      assert.equal(JSON.stringify(store.getActions()), JSON.stringify(expectedActions));
      signInStub.restore();
    });
  });
});
