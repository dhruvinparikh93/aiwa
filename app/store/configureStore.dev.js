import { applyMiddleware, createStore, compose } from 'redux';
import thunk from 'redux-thunk';
import hydrateAppReducer from '../reducers/hydrate';
import storage from '../utils/storage';

// If Redux DevTools Extension is installed use it, otherwise use Redux compose
/* eslint-disable no-underscore-dangle */
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
  ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
    // Options: http://zalmoxisus.github.io/redux-devtools-extension/API/Arguments.html
  })
  : compose;
/* eslint-enable no-underscore-dangle */

const enhancer = composeEnhancers(applyMiddleware(thunk), storage());

let store;

function getStore(initialState) {
  if (store === undefined) {
    store = createStore(hydrateAppReducer, initialState, enhancer);
  }

  if (module.hot) {
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers');

      store.replaceReducer(nextRootReducer);
    });
  }
  return store;
}

function getStoreBackgroundJS(initialState) {
  const bgStore = createStore(hydrateAppReducer, initialState, enhancer);
  if (module.hot) {
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers');

      store.replaceReducer(nextRootReducer);
    });
  }
  return bgStore;
}

export default { getStore, getStoreBackgroundJS };
