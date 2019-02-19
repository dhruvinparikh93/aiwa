import {
  CHANGE_CURRENT_NETWORK,
  UPDATE_NETWORK_LIST,
  AION_NETWORK_LIST,
  ETH_NETWORK_LIST,
  SHOW_NETWORK_LIST,
} from '../constants/networks';
import config from '../app.config';

const initialState = {
  networks: config.currentWalletType === 'aionWallet' ? AION_NETWORK_LIST : ETH_NETWORK_LIST,
  //KP: selected Aion Network must be same as in initializeWeb3() call in browser/extension/contentScript.js
  currentNetwork:
    config.currentWalletType === 'aionWallet' ? AION_NETWORK_LIST[1] : ETH_NETWORK_LIST[1], // network object, should have 'name' and 'chainId'
  showNetworkList: false,
};

const networks = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_NETWORK_LIST:
      return { ...state, networks: action.payload };
    case CHANGE_CURRENT_NETWORK:
      return { ...state, currentNetwork: action.payload };
    case SHOW_NETWORK_LIST:
      return { ...state, showNetworkList: action.payload };
    default:
      return state;
  }
};

export default networks;
