import { applyMiddleware, createStore, compose } from 'redux';
import thunk from 'redux-thunk';
import hydrateAppReducer from '../reducers/hydrate';
import storage from '../utils/storage';

const middlewares = applyMiddleware(thunk);
const enhancer = compose(
  middlewares,
  storage(),
);

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
