import sinon from 'sinon';
import assert from 'assert';
import _ from 'lodash';
import * as transactionService from '../../../app/services/transactionService';
import * as storage from '../../../app/utils/storage';
import * as mocks from './services.mocks';
import * as tokenService from '../../../app/services/tokenService';

describe('#createTransactionObject', () => {
  it('it should create transaction object for send AION from DApp', async () => {
    const store = global.mockStore(mocks.store);
    const {
      modifiedTo,
      amount,
      validatedHexData,
      modifiedSelectedToken,
      privateKey,
      networkFullUrl,
    } = mocks.sendAIONGetNrgLimitDAppArg;
    const stubStore = sinon.stub(storage, 'getStore').returns(store);
    const stubFetchTokenData = sinon.stub(tokenService, 'fetchTokenData');
    stubFetchTokenData
      .withArgs(mocks.sendAIONTxObjDApp.to, mocks.networkFullUrl)
      .returns(mocks.nonERC777TokenData);
    const stubIsContract = sinon.stub(tokenService, 'isContract');
    stubIsContract.withArgs(mocks.sendAIONTxObjDApp.to, mocks.networkFullUrl).returns(false);
    const stubGetNrgLimit = sinon.stub(tokenService, 'getNrgLimit');
    stubGetNrgLimit
      .withArgs(
        modifiedTo,
        amount,
        validatedHexData,
        modifiedSelectedToken,
        privateKey,
        networkFullUrl,
      )
      .returns(mocks.sendAIONGetNrgLimitDApp);
    const stubGetNrgPrice = sinon.stub(tokenService, 'getNrgPrice');
    stubGetNrgPrice.withArgs(mocks.privateKey).returns(mocks.sendAIONGetNrgPriceDApp);
    const transactionObj = await transactionService.createTransactionObj(mocks.sendAIONTxObjDApp);
    assert.equal(
      JSON.stringify(transactionObj),
      JSON.stringify(mocks.sendAIONExpectedTxObjDApp),
      'The tx object should be as expected',
    );
    stubStore.restore();
    stubFetchTokenData.restore();
    stubIsContract.restore();
    stubGetNrgLimit.restore();
    stubGetNrgPrice.restore();
  });
  it('it should create transaction object for send AION from Extension', async () => {
    const store = global.mockStore(mocks.store);
    const {
      modifiedTo,
      amount,
      validatedHexData,
      modifiedSelectedToken,
      privateKey,
      networkFullUrl,
    } = mocks.sendAIONGetNrgLimitExtArg;
    const stubStore = sinon.stub(storage, 'getStore').returns(store);
    const stubFetchTokenData = sinon.stub(tokenService, 'fetchTokenData');
    stubFetchTokenData
      .withArgs(mocks.sendAIONTxObjExt.to, mocks.networkFullUrl)
      .returns(mocks.nonERC777TokenData);
    const stubIsContract = sinon.stub(tokenService, 'isContract');
    stubIsContract.withArgs(mocks.sendAIONTxObjDApp.to, mocks.networkFullUrl).returns(false);
    const stubGetNrgLimit = sinon.stub(tokenService, 'getNrgLimit');
    stubGetNrgLimit
      .withArgs(
        modifiedTo,
        amount,
        validatedHexData,
        modifiedSelectedToken,
        privateKey,
        networkFullUrl,
      )
      .returns(mocks.sendAIONGetNrgLimitExt);
    const stubGetNrgPrice = sinon.stub(tokenService, 'getNrgPrice');
    stubGetNrgPrice.withArgs(mocks.privateKey).returns(mocks.sendAIONGetNrgPriceExt);
    const transactionObj = await transactionService.createTransactionObj(mocks.sendAIONTxObjExt);
    assert.equal(
      JSON.stringify(transactionObj),
      JSON.stringify(mocks.sendAIONExpectedTxObjExt),
      'The tx object should be as expected',
    );
    stubStore.restore();
    stubFetchTokenData.restore();
    stubIsContract.restore();
    stubGetNrgLimit.restore();
    stubGetNrgPrice.restore();
  });
  it('it should create transaction object for send TOKEN from DApp', async () => {
    const store = global.mockStore(mocks.store);
    const {
      modifiedTo,
      amount,
      validatedHexData,
      modifiedSelectedToken,
      privateKey,
      networkFullUrl,
    } = mocks.sendTokenGetNrgLimitDAppArg;
    const stubStore = sinon.stub(storage, 'getStore').returns(store);
    const stubFetchTokenData = sinon.stub(tokenService, 'fetchTokenData');
    stubFetchTokenData
      .withArgs(mocks.sendTokenObjDApp.to, mocks.networkFullUrl)
      .returns(mocks.erc777TokenData);
    const stubFetchTokenBalance = sinon.stub(tokenService, 'fetchTokenBalance');
    stubFetchTokenBalance
      .withArgs(store.getState().wallets.currentWallet, mocks.sendTokenObjDApp.to, networkFullUrl)
      .returns('4420');
    const stubGetNrgLimit = sinon.stub(tokenService, 'getNrgLimit');
    stubGetNrgLimit
      .withArgs(
        modifiedTo,
        amount,
        validatedHexData,
        modifiedSelectedToken,
        privateKey,
        networkFullUrl,
      )
      .returns(mocks.sendTokenGetNrgLimitDApp);
    const stubGetNrgPrice = sinon.stub(tokenService, 'getNrgPrice');
    stubGetNrgPrice.withArgs(mocks.privateKey).returns(mocks.sendTokenGetNrgPriceDApp);
    const transactionObj = await transactionService.createTransactionObj(mocks.sendTokenObjDApp);
    assert.equal(
      JSON.stringify(transactionObj),
      JSON.stringify(mocks.sendTokenExpectedTxObjDApp),
      'The tx object should be as expected',
    );
    stubStore.restore();
    stubFetchTokenData.restore();
    stubFetchTokenBalance.restore();
    stubGetNrgLimit.restore();
    stubGetNrgPrice.restore();
  });
  it('it should create transaction object for send TOKEN from Extension', async () => {
    const store = global.mockStore(mocks.storeTokenSelected);
    const {
      modifiedTo,
      amount,
      validatedHexData,
      modifiedSelectedToken,
      privateKey,
      networkFullUrl,
    } = mocks.sendTokenGetNrgLimitExtArg;
    const stubStore = sinon.stub(storage, 'getStore').returns(store);
    const stubGetNrgLimit = sinon.stub(tokenService, 'getNrgLimit');
    stubGetNrgLimit
      .withArgs(
        modifiedTo,
        amount,
        validatedHexData,
        modifiedSelectedToken,
        privateKey,
        networkFullUrl,
      )
      .returns(mocks.sendTokenGetNrgLimitExt);
    const stubGetNrgPrice = sinon.stub(tokenService, 'getNrgPrice');
    stubGetNrgPrice.withArgs(mocks.privateKey).returns(mocks.sendTokenGetNrgPriceExt);
    const transactionObj = await transactionService.createTransactionObj(mocks.sendAIONTokenObjExt);
    assert.equal(
      JSON.stringify(transactionObj),
      JSON.stringify(mocks.sendTokenExpectedTxObjExt),
      'The tx object should be as expected',
    );
    stubStore.restore();
    stubGetNrgLimit.restore();
    stubGetNrgPrice.restore();
  });
  it('it should create transaction object for deploy contract', async () => {
    const store = global.mockStore(mocks.store);
    const {
      modifiedTo,
      amount,
      validatedHexData,
      modifiedSelectedToken,
      privateKey,
      networkFullUrl,
    } = mocks.deployContractGetNrgLimitDAppArg;
    const stubStore = sinon.stub(storage, 'getStore').returns(store);
    const stubFetchTokenData = sinon.stub(tokenService, 'fetchTokenData');
    stubFetchTokenData
      .withArgs(mocks.deployContractObjDApp.to, mocks.networkFullUrl)
      .returns(mocks.nonERC777TokenData1);
    const stubGetNrgLimit = sinon.stub(tokenService, 'getNrgLimit');
    stubGetNrgLimit
      .withArgs(
        modifiedTo,
        amount,
        validatedHexData,
        modifiedSelectedToken,
        privateKey,
        networkFullUrl,
      )
      .returns(mocks.deployContractGetNrgLimitDApp);
    const stubGetNrgPrice = sinon.stub(tokenService, 'getNrgPrice');
    stubGetNrgPrice.withArgs(mocks.privateKey).returns(mocks.deployContractGetNrgPriceDApp);
    const transactionObj = await transactionService.createTransactionObj(
      mocks.deployContractObjDApp,
    );
    assert.equal(
      JSON.stringify(transactionObj),
      JSON.stringify(mocks.deployContractExpectedTxObjDApp),
      'The tx object should be as expected',
    );
    stubStore.restore();
    stubFetchTokenData.restore();
    stubGetNrgLimit.restore();
    stubGetNrgPrice.restore();
  });
  it('it should create transaction object for deploy contract with custom gas and gasPrice', async () => {
    const store = global.mockStore(mocks.store);
    const stubStore = sinon.stub(storage, 'getStore').returns(store);
    const stubFetchTokenData = sinon.stub(tokenService, 'fetchTokenData');
    stubFetchTokenData
      .withArgs(mocks.deployContractObjCustomGasDApp.to, mocks.networkFullUrl)
      .returns(mocks.nonERC777TokenData1);
    const transactionObj = await transactionService.createTransactionObj(
      mocks.deployContractObjCustomGasDApp,
    );
    assert.equal(
      JSON.stringify(transactionObj),
      JSON.stringify(mocks.deployContractExpectedTxObjCustomGasDApp),
      'The tx object should be as expected',
    );
    stubStore.restore();
    stubFetchTokenData.restore();
  });
  it('it should create transaction object for calling contract function', async () => {
    const store = global.mockStore(mocks.store);
    const {
      modifiedTo,
      amount,
      validatedHexData,
      modifiedSelectedToken,
      privateKey,
      networkFullUrl,
    } = mocks.callContractFunctionGetNrgLimitDAppArg;
    const stubStore = sinon.stub(storage, 'getStore').returns(store);
    const stubFetchTokenData = sinon.stub(tokenService, 'fetchTokenData');
    stubFetchTokenData
      .withArgs(mocks.callContractFunctionObjDApp.to, mocks.networkFullUrl)
      .returns(mocks.nonERC777TokenData2);
    const stubIsContract = sinon.stub(tokenService, 'isContract');
    stubIsContract
      .withArgs(mocks.callContractFunctionObjDApp.to, mocks.networkFullUrl)
      .returns(true);
    const stubGetNrgLimit = sinon.stub(tokenService, 'getNrgLimit');
    stubGetNrgLimit
      .withArgs(
        modifiedTo,
        amount,
        validatedHexData,
        modifiedSelectedToken,
        privateKey,
        networkFullUrl,
      )
      .returns(mocks.callContractFunctionGetNrgLimitDApp);
    const stubGetNrgPrice = sinon.stub(tokenService, 'getNrgPrice');
    stubGetNrgPrice.withArgs(mocks.privateKey).returns(mocks.callContractFunctionGetNrgPriceDApp);
    const transactionObj = await transactionService.createTransactionObj(
      mocks.callContractFunctionObjDApp,
    );
    assert.equal(
      JSON.stringify(transactionObj),
      JSON.stringify(mocks.callContractFunctionExpectedTxObjDApp),
      'The tx object should be as expected',
    );
    stubStore.restore();
    stubFetchTokenData.restore();
    stubGetNrgLimit.restore();
    stubGetNrgPrice.restore();
  });
});

describe('#getSendConfirmScreenDisplayItems', () => {
  it('it should be able to get parameters to display on send confirm screen when sending AION from DApp', () => {
    const output = transactionService.getSendConfirmScreenDisplayItems(
      mocks.sendAIONExpectedTxObjDApp,
    );
    assert(
      _.isEqual(output, mocks.sendAIONExpectedDisplayObjDApp),
      'The output should be as expected',
    );
  });
  it('it should be able to get parameters to display on send confirm screen when sending AION from Extension', () => {
    const output = transactionService.getSendConfirmScreenDisplayItems(
      mocks.sendAIONExpectedTxObjExt,
    );
    assert(
      _.isEqual(output, mocks.sendAIONExpectedDisplayObjExt),
      'The output should be as expected',
    );
  });
  it('it should be able to get parameters to display on send confirm screen when sending TOKEN from DApp', () => {
    const output = transactionService.getSendConfirmScreenDisplayItems(
      mocks.sendTokenExpectedTxObjDApp,
    );
    assert.equal(
      JSON.stringify(output),
      JSON.stringify(mocks.sendTokenExpectedDisplayObjDApp),
      'The tx object should be as expected',
    );
  });
  it('it should be able to get parameters to display on send confirm screen when sending TOKEN from Extension', () => {
    const output = transactionService.getSendConfirmScreenDisplayItems(
      mocks.sendTokenExpectedTxObjExt,
    );
    assert(
      _.isEqual(output, mocks.sendTokenExpectedDisplayObjExt),
      'The output should be as expected',
    );
  });
  it('it should be able to get parameters to display on send confirm screen when deploying contract', () => {
    const output = transactionService.getSendConfirmScreenDisplayItems(
      mocks.deployContractExpectedTxObjDApp,
    );
    assert(
      _.isEqual(output, mocks.deployContractExpectedDisplayObjDApp),
      'The output should be as expected',
    );
  });
  it('it should be able to get parameters to display on send confirm screen when calling contract function', () => {});
});

describe('#getTransactionDisplayList', () => {
  it('it should able to get the transaction list during pending state for send AION from DApp', () => {
    const output = transactionService.getTransactionDisplayList(
      mocks.sendAIONTransactionsPendingDApp,
      mocks.store.networks.currentNetwork,
    );
    assert(
      _.isEqual(output, mocks.sendAIONTransactionsPendingDisplayDApp),
      'The transaction list should be as expected',
    );
  });
  it('it should able to get the transaction list during done state for send AION from DApp', () => {
    const output = transactionService.getTransactionDisplayList(
      mocks.sendAIONTransactionsMinedDApp,
      mocks.store.networks.currentNetwork,
    );
    assert(
      _.isEqual(output, mocks.sendAIONTransactionsMinedDisplayDApp),
      'The transaction list should be as expected',
    );
  });
  it('it should able to get the transaction list during pending state for send TOKEN from DApp', () => {
    const output = transactionService.getTransactionDisplayList(
      mocks.sendTokenTransactionsPendingDApp,
      mocks.store.networks.currentNetwork,
    );
    assert(
      _.isEqual(output, mocks.sendTokenTransactionsPendingDisplayDApp),
      'The transaction list should be as expected',
    );
  });
  it('it should able to get the transaction list during done state for send TOKEN from DApp', () => {
    const output = transactionService.getTransactionDisplayList(
      mocks.sendTokenTransactionsMinedDApp,
      mocks.store.networks.currentNetwork,
    );
    assert(
      _.isEqual(output, mocks.sendTokenTransactionsMinedDisplayDApp),
      'The transaction list should be as expected',
    );
  });
  it('it should able to get the transaction list during pending state for contract deployment', () => {
    const output = transactionService.getTransactionDisplayList(
      mocks.deployContractTransactionsPendingDApp,
      mocks.store.networks.currentNetwork,
    );
    assert(
      _.isEqual(output, mocks.deployContractTransactionsPendingDisplayDApp),
      'The transaction list should be as expected',
    );
  });
  it('it should able to get the transaction list during done state for contract deployment', () => {
    const output = transactionService.getTransactionDisplayList(
      mocks.deployContractTransactionsMinedDApp,
      mocks.store.networks.currentNetwork,
    );
    assert(
      _.isEqual(output, mocks.deployContractTransactionsMinedDisplayDApp),
      'The transaction list should be as expected',
    );
  });
  it('it should able to get the transaction list during pending state for calling contract function', () => {
    const output = transactionService.getTransactionDisplayList(
      mocks.callContractFunctionTransactionsPendingDApp,
      mocks.store.networks.currentNetwork,
    );
    assert(
      _.isEqual(output, mocks.callContractFunctionTransactionsPendingDisplayDApp),
      'The transaction list should be as expected',
    );
  });
  it('it should able to get the transaction list during done state for calling contract function', () => {
    const output = transactionService.getTransactionDisplayList(
      mocks.callContractFunctionTransactionsMinedDApp,
      mocks.store.networks.currentNetwork,
    );
    assert(
      _.isEqual(output, mocks.callContractFunctionTransactionsMinedDisplayDApp),
      'The transaction list should be as expected',
    );
  });
  it('it should able to get the transaction list during pending state for send AION from Extension', () => {
    const output = transactionService.getTransactionDisplayList(
      mocks.sendAIONTransactionsPendingExt,
      mocks.store.networks.currentNetwork,
    );
    assert(
      _.isEqual(output, mocks.sendAIONTransactionsPendingDisplayExt),
      'The transaction list should be as expected',
    );
  });
  it('it should able to get the transaction list during done state for send AION from Extension', () => {
    const output = transactionService.getTransactionDisplayList(
      mocks.sendAIONTransactionsMinedExt,
      mocks.store.networks.currentNetwork,
    );
    assert(
      _.isEqual(output, mocks.sendAIONTransactionsMinedDisplayExt),
      'The transaction list should be as expected',
    );
  });
  it('it should able to get the transaction list during pending state for send TOKEN from Extension', () => {
    const output = transactionService.getTransactionDisplayList(
      mocks.sendTokenTransactionsPendingExt,
      mocks.store.networks.currentNetwork,
    );
    assert(
      _.isEqual(output, mocks.sendTokenTransactionsPendingDisplayExt),
      'The transaction list should be as expected',
    );
  });
  it('it should able to get the transaction list during done state for send TOKEN from Extension', () => {
    const output = transactionService.getTransactionDisplayList(
      mocks.sendTokenTransactionsMinedExt,
      mocks.store.networks.currentNetwork,
    );
    assert(
      _.isEqual(output, mocks.sendTokenTransactionsMinedDisplayExt),
      'The transaction list should be as expected',
    );
  });
});

describe('#getToAlias', () => {
  it('it should able to get toAlias with ERC777', () => {
    const store = global.mockStore(mocks.store);
    const { modifiedTo, networkFullUrl } = mocks.sendAIONGetNrgLimitDAppArg;
    const output = transactionService.getToAlias(
      true,
      store.getState().wallets,
      modifiedTo,
      networkFullUrl,
      mocks.addressBook,
    );
    assert(_.isEqual(output, 'Wallet 2'), 'The ouput should be as expected');
  });
  it('it should able to get toAlias without ERC777', () => {
    const store = global.mockStore(mocks.store);
    const { modifiedTo, networkFullUrl } = mocks.sendAIONGetNrgLimitDAppArg;
    const output = transactionService.getToAlias(
      false,
      store.getState().wallets,
      modifiedTo,
      networkFullUrl,
      mocks.addressBook,
    );
    assert(_.isEqual(output, 'Wallet 2'), 'The ouput should be as expected');
  });
  it('it should able to get toAlias from address book without ERC777', () => {
    const store = global.mockStore(mocks.store);
    const { networkFullUrl } = mocks.sendAIONGetNrgLimitDAppArg;
    const output = transactionService.getToAlias(
      false,
      store.getState().wallets,
      '0xa0e4c8213a0cc0a6edb33341dec44328a1f6dea823dd1aa77193562428b81403',
      networkFullUrl,
      mocks.addressBook,
    );
    assert(_.isEqual(output, 'M1'), 'The ouput should be as expected');
  });
});
