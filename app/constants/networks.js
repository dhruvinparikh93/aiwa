export const CHANGE_CURRENT_NETWORK = 'CHANGE_CURRENT_NETWORK';
export const UPDATE_NETWORK_LIST = 'UPDATE_NETWORK_LIST';
export const SHOW_NETWORK_LIST = 'SHOW_NETWORK_LIST';

export function updateNetworkList(_networks) {
  return {
    type: UPDATE_NETWORK_LIST,
    payload: _networks,
  };
}

export function changeCurrentNetwork(_network) {
  return {
    type: CHANGE_CURRENT_NETWORK,
    payload: _network,
  };
}

export function showNetworks(_flag) {
  return {
    type: SHOW_NETWORK_LIST,
    payload: _flag,
  };
}

export const AION_NETWORK_LIST = [
  {
    text: 'Mainnet',
    value: 'mainnet',
    networkURL:
      'https://api.nodesmith.io/v1/aion/mainnet/jsonrpc?apiKey=85268e8181c74b249a93581a8cb9c213',
    networkPort: '',
    networkFullUrl:
      'https://api.nodesmith.io/v1/aion/mainnet/jsonrpc?apiKey=85268e8181c74b249a93581a8cb9c213',
    transactionUrl: 'https://mainnet.aion.network/#/transaction/',
  },
  {
    text: 'Mastery',
    value: 'mastery',
    networkURL:
      'https://api.nodesmith.io/v1/aion/testnet/jsonrpc?apiKey=85268e8181c74b249a93581a8cb9c213',
    networkPort: '',
    networkFullUrl:
      'https://api.nodesmith.io/v1/aion/testnet/jsonrpc?apiKey=85268e8181c74b249a93581a8cb9c213',
    transactionUrl: 'https://mastery.aion.network/#/transaction/',
  },
  {
    text: 'Localhost',
    value: 'localhost',
    networkURL: 'http://127.0.0.1',
    networkPort: '8545',
    networkFullUrl: 'http://127.0.0.1:8545',
  },
  {
    text: 'Custom',
    value: 'custom',
    networkURL: 'http://localhost',
    networkPort: '8545',
    networkFullUrl: 'http://localhost:8545',
  },
];
export const ETH_NETWORK_LIST = [
  {
    text: 'Main Network',
    value: 'mainnet',
    networkURL: '',
    networkPort: '',
    networkFullUrl: '',
  },
  {
    text: 'Kovan Test Network',
    value: 'kovan',
    networkURL: '',
    networkPort: '',
    networkFullUrl: '',
  },
  {
    text: 'Ropsten Test Network',
    value: 'ropsten',
    networkURL: '',
    networkPort: '',
    networkFullUrl: '',
  },
  {
    text: 'RinkeBy Test Network',
    value: 'rinkeby',
    networkURL: '',
    networkPort: '',
    networkFullUrl: '',
  },
  {
    text: 'Custom',
    value: 'custom',
    url: 'http://localhost',
    networkPort: '8545',
    networkFullUrl: 'http://localhost:8545',
  },
];
