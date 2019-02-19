import { combineReducers } from 'redux';
import appState from './appState';
import accounts from './accounts';
import networks from './networks';
import transactions from './transactions';
import wallets from './wallets';
import vaults from './vaults';
import toast from './toast';
import tokens from './tokens';
import animationReducer from './animation';
import message from './message';
import security from './security';

export default combineReducers({
  appState,
  animationReducer,
  accounts,
  wallets,
  networks,
  transactions,
  vaults,
  toast,
  tokens,
  message,
  security,
});
