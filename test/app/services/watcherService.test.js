import sinon from 'sinon';
import axios from 'axios';
import * as WatcherService from '../../../app/services/watcherService';
import { AION_NETWORK_LIST } from '../../../app/constants/networks';
import * as storage from '../../../app/utils/storage';

const assert = require('assert');

const wallet1 = {
  privateKey:
    '0x1a3323ac1d6a41c64b30eff05809c9338e2d2349040c95c6fcf667b47fa596a0cfd3f04a73e8c1d8411abd73760204aee2d276e67aa8fed9b485a7077189a5d',
  address: '0xa0080f1022b8a94da1ec0172b521b2ff5c082c7978672e2e96a4bdb9fde8562a',
  alias: 'Wallet 1',
};
describe('WatcherService', () => describe('#verifyConnection()', () => {
  it('AION Mainnet Connection should work when provide correct url', async () => {
    const mockResponse = { status: 200 };
    const axiosStub = sinon.stub(axios, 'post');
    axiosStub.withArgs(AION_NETWORK_LIST[0].networkFullUrl).returns(mockResponse);
    const connection = await WatcherService.verifyConnection(
      AION_NETWORK_LIST[0].networkFullUrl,
      wallet1.address,
    );
    assert(connection.statusCode === mockResponse.status, 'Mainnet Working correct');
    axiosStub.restore();
  });

  it('AION Mainnet Connection not work when provide incorrect url', async () => {
    const mockResponse = { status: 401 };
    const axiosStub = sinon.stub(axios, 'post');
    axiosStub.withArgs('xyz').returns(mockResponse);
    try {
      await WatcherService.verifyConnection(AION_NETWORK_LIST[0].networkFullUrl, wallet1.address);
    } catch (e) {
      assert(e.code === mockResponse.status, 'Handeling Unauthorized request');
    }
    axiosStub.restore();
  });

  it('AION Mainnet Connection not work', async () => {
    const mockResponse = { status: 404 };
    const axiosStub = sinon.stub(axios, 'post');
    axiosStub.withArgs(AION_NETWORK_LIST[0].networkFullUrl).returns(mockResponse);
    try {
      await WatcherService.verifyConnection(AION_NETWORK_LIST[0].networkFullUrl, wallet1.address);
    } catch (e) {
      assert(e.code === 'ECONNABORTED', 'Connection Time out...Not Found');
    }

    axiosStub.restore();
  });

  it('AION Mainnet Connection not work', async () => {
    const mockResponse = { status: 500 };
    const axiosStub = sinon.stub(axios, 'post');
    axiosStub.withArgs(AION_NETWORK_LIST[0].networkFullUrl).returns(mockResponse);
    try {
      await WatcherService.verifyConnection(AION_NETWORK_LIST[0].networkFullUrl, wallet1.address);
    } catch (e) {
      assert(e.code === mockResponse.status, 'Internal Server Error..');
    }

    axiosStub.restore();
  });
}));

describe('#checkConnectivity()', () => {
  it('AION Mainnet Connection should work', async () => {
    const store = {
      getState: sinon.stub(),
    };
    const state = {
      wallets: {
        currentWallet: {
          address: wallet1.address,
        },
      },
      networks: {
        currentNetWork: {
          networkFullUrl: AION_NETWORK_LIST[0].networkFullUrl,
        },
      },
    };
    store.getState.returns(state);
    const stub = sinon.stub(storage, 'getStore').returns(store);
    WatcherService.checkConnectivity();
    stub.restore();
  });
});
