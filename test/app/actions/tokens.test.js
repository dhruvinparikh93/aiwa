import sinon from 'sinon';
import * as tokenService from '../../../app/services/tokenService';
import * as tokenConstants from '../../../app/constants/tokens';
import * as actions from '../../../app/actions/tokens';
import * as mocks from './mocks';

const assert = require('assert');

describe('Tokens Actions', () => {
  describe('addTokenToList', () => {
    it('should dispatch UPDATE_TOKEN_LIST on successful addition', async () => {
      const tokenDataStub = sinon.stub(tokenService, 'fetchTokenData').returns(mocks.newTokenData);
      const tokenBalanceStub = sinon.stub(tokenService, 'fetchTokenBalance').returns(0);

      const expectedActions = [
        {
          type: tokenConstants.UPDATE_TOKEN_LIST,
          payload: mocks.addTokenSuccessfulPayload,
        },
      ];

      const marketData = {
        ...mocks.defaultAppState.marketData,
        ...{
          aiwa3: {
            marketData: {
              error: 'Could not find coin with given id',
            },
          },
        },
      };

      const store = global.mockStore({
        ...mocks.defaultState,
        ...{
          appState: {
            marketData,
          },
        },
      });

      await store.dispatch(
        actions.addTokenToList(
          '0xa02210f678afce1cc5ce2eb57b5c6c12186742f71094761d7fbeea38dd3b0495',
        ),
      );
      assert.equal(JSON.stringify(store.getActions()), JSON.stringify(expectedActions));
      tokenDataStub.restore();
      tokenBalanceStub.restore();
    });
  });
  describe('removeTokenFromList', () => {
    it('should dispatch UPDATE_TOKEN_LIST on successful remove', async () => {
      const expectedActions = [
        {
          type: tokenConstants.UPDATE_TOKEN_LIST,
          payload: mocks.removeTokenSuccessfulPayload,
        },
      ];

      const store = global.mockStore({
        ...mocks.defaultState,
        ...{
          tokens: {
            ...mocks.defaultTokensState,
            tokenList: {
              ...mocks.addTokenSuccessfulPayload,
            },
          },
        },
      });
      await store.dispatch(
        actions.removeTokenFromList(
          '0xa02210f678afce1cc5ce2eb57b5c6c12186742f71094761d7fbeea38dd3b0495',
        ),
      );
      assert.equal(JSON.stringify(store.getActions()), JSON.stringify(expectedActions));
    });
  });
});
