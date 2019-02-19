import sinon from 'sinon';
import axios from 'axios';
import * as browserService from '../../../app/services/browserService';
import * as tokenService from '../../../app/services/tokenService';
import * as commonConstants from '../../../app/constants/common';
import * as tokenConstants from '../../../app/constants/tokens';
import * as transConstants from '../../../app/constants/transactions';
import * as actions from '../../../app/actions/home';
import * as mocks from './mocks';

const assert = require('assert');

describe('Home Actions', () => {
  describe('verifyAcceptedTouVersion', () => {
    it('should dispatch CHECK_ACCEPTED_TOU_VERSION with a value of false if versions are the same', async () => {
      const stub = sinon.stub(browserService, 'getLocalStorage');
      stub.withArgs('touVersion').returns(mocks.currentTouVersion);

      const expectedActions = [
        {
          type: commonConstants.CHECK_ACCEPTED_TOU_VERSION,
          payload: false,
        },
      ];

      const store = global.mockStore(mocks.defaultAppState);

      await store.dispatch(actions.verifyAcceptedTouVersion());

      assert.equal(JSON.stringify(store.getActions()), JSON.stringify(expectedActions));
      stub.restore();
    });

    it('should dispatch CHECK_ACCEPTED_TOU_VERSION with a value of true if versions are not the same', async () => {
      const stub = sinon.stub(browserService, 'getLocalStorage');
      stub.withArgs('touVersion').returns({
        touVersion: '3',
      });

      const expectedActions = [
        {
          type: commonConstants.CHECK_ACCEPTED_TOU_VERSION,
          payload: true,
        },
      ];

      const store = global.mockStore(mocks.defaultAppState);

      await store.dispatch(actions.verifyAcceptedTouVersion());

      assert.equal(JSON.stringify(store.getActions()), JSON.stringify(expectedActions));
      stub.restore();
    });
  });

  describe('fetchMarketData', () => {
    it('should dispatch MARKET_DATA on successful request', async () => {
      const stub = sinon.stub(axios, 'get');
      const url = 'https://api.coingecko.com/api/v3/coins/aion';
      stub.withArgs(url).returns(mocks.marketDataSuccessfulResponse);

      const expectedActions = [
        {
          type: commonConstants.MARKET_DATA,
          payload: mocks.marketDataSuccessfulPayload,
        },
      ];

      const store = global.mockStore(mocks.defaultAppState);

      await store.dispatch(actions.fetchMarketData('aion'));

      assert.equal(JSON.stringify(store.getActions()), JSON.stringify(expectedActions));
      stub.restore();
    });

    it('should dispatch MARKET_DATA when tokenId is undefined', async () => {
      const expectedActions = [
        {
          type: commonConstants.MARKET_DATA,
          payload: mocks.tokenUndefinedPayload,
        },
      ];

      const store = global.mockStore(mocks.defaultAppState);

      await store.dispatch(actions.fetchMarketData());
      assert.equal(JSON.stringify(store.getActions()), JSON.stringify(expectedActions));
    });

    it('should dispatch MARKET_DATA on failed request', async () => {
      const stub = sinon.stub(axios, 'get');
      const url = 'https://api.coingecko.com/api/v3/coins/aion';
      stub.withArgs(url).returns(mocks.marketDataFailedResponse);

      const expectedActions = [
        {
          type: commonConstants.MARKET_DATA,
          payload: mocks.marketDataFailedPayload,
        },
      ];

      const store = global.mockStore(mocks.defaultAppState);

      await store.dispatch(actions.fetchMarketData('aion'));
      assert.equal(JSON.stringify(store.getActions()), JSON.stringify(expectedActions));
      stub.restore();
    });
  });

  describe('fetchAionCoinDetails', () => {
    it('should dispatch UPDATE_TOKEN_LIST', async () => {
      const stub = sinon.stub(tokenService, 'fetchTokenBalance').returns(0);

      const expectedActions = [
        {
          type: tokenConstants.UPDATE_TOKEN_LIST,
          payload: mocks.tokenDetailsSuccessfulPayload,
        },
      ];

      const store = global.mockStore(mocks.defaultState);

      await store.dispatch(actions.fetchAionCoinDetails());
      assert.equal(JSON.stringify(store.getActions()), JSON.stringify(expectedActions));
      stub.restore();
    });
  });

  describe('initializeWallet', () => {
    it('should dispatch MARKET_DATA, UPDATE_TOKEN_LIST, ISLOADING, CHANGE_SELECTED_TOKEN, UPDATE_TOKEN_LIST, UPDATE_TRANSACTION_LIST, ISLOADING on successful request', async () => {
      const tokenStub = sinon.stub(tokenService, 'fetchTokenBalance').returns(0);
      const axiosStub = sinon.stub(axios, 'get');
      const transStub = sinon.stub(browserService, 'getLocalStorage');
      transStub.withArgs('transactions').returns(mocks.transactionsLocalStorageObj1);

      const url = 'https://api.coingecko.com/api/v3/coins/aion';
      axiosStub.withArgs(url).returns(mocks.marketDataSuccessfulResponse);

      const expectedActions = [
        {
          type: commonConstants.ISLOADING,
          payload: false,
        },
        {
          type: commonConstants.MARKET_DATA,
          payload: mocks.marketDataSuccessfulPayload,
        },
        {
          type: transConstants.UPDATE_TRANSACTION_LIST,
          payload: mocks.updateTxnListPayload,
        },
      ];

      const store = global.mockStore(mocks.defaultState);

      await store.dispatch(actions.initializeWallet());
      assert.equal(JSON.stringify(store.getActions()), JSON.stringify(expectedActions));
      transStub.restore();
      tokenStub.restore();
      axiosStub.restore();
    });
  });
});
