import Animated from 'animated/lib/targets/react-dom';
import { showNetworks } from './networks';

// Constants Used for Vault Settings
export const IMPORT_VAULT_ITEM = 'IMPORT_VAULT_ITEM';
export const EXPORT_VAULT_ITEM = 'EXPORT_VAULT_ITEM';
export const SESSION_TIMEOUT_ITEM = 'SESSION_TIMEOUT_ITEM';
export const EXPORT_SEED_WORDS_ITEM = 'EXPORT_SEED_WORDS_ITEM';
export const PRIVACY_MODE_ITEM = 'PRIVACY_MODE_ITEM';
export const settingsItemsArr = [
  IMPORT_VAULT_ITEM,
  EXPORT_VAULT_ITEM,
  EXPORT_SEED_WORDS_ITEM,
  SESSION_TIMEOUT_ITEM,
  PRIVACY_MODE_ITEM,
];

// Constants used for Wallet Settings
export const EXPORT_PRIVATE_KEY_ITEM = 'EXPORT_PRIVATE_KEY_ITEM';
export const IMPORT_WALLET_ITEM = 'IMPORT_WALLET_ITEM';
export const walletSettingsItemsArr = [EXPORT_PRIVATE_KEY_ITEM, IMPORT_WALLET_ITEM];

// Constant used for Application wide Settings/Dropdowns
export const VAULT_SETTINGS = 'VAULT_SETTINGS';
export const NETWORK_DROPDOWN_SETTINGS = 'NETWORK_DROPDOWN_SETTINGS';
export const WALLET_SETTINGS = 'WALLET_SETTINGS';
export const WALLET_DROPDOWN = 'WALLET_DROPDOWN';
export const TOKEN_MARKET_DATA = 'TOKEN_MARKET_DATA';
export const applicationSettingsArr = [
  WALLET_SETTINGS,
  WALLET_DROPDOWN,
  VAULT_SETTINGS,
  NETWORK_DROPDOWN_SETTINGS,
  TOKEN_MARKET_DATA,
];

// Declare Array for Open Animations (Application Wide). This should not be touched
export const expandApplicationSettingArr = [];

// Create Map For Application wide Settings
const applicationSettingsAnimatedMapTemp = new Map();
applicationSettingsArr.forEach(item => {
  applicationSettingsAnimatedMapTemp.set(item, new Animated.Value(0));
});
export const applicationSettingsAnimatedMap = applicationSettingsAnimatedMapTemp;

const settingsItemAnimatedMapTemp = new Map();
const settingsItemHighlightMapTemp = new Map();
settingsItemsArr.forEach(item => {
  settingsItemAnimatedMapTemp.set(item, new Animated.Value(0));
  settingsItemHighlightMapTemp.set(item, false);
});

// Map of Animated Objects for Vault Settings Items
export const settingsItemAnimatedMap = settingsItemAnimatedMapTemp;
export const settingsItemHighlightMap = settingsItemHighlightMapTemp;

const walletSettingsItemAnimatedMapTemp = new Map();
const walletSettingsItemHighlightMapTemp = new Map();
walletSettingsItemsArr.forEach(item => {
  walletSettingsItemAnimatedMapTemp.set(item, new Animated.Value(0));
  walletSettingsItemHighlightMapTemp.set(item, false);
});

// Map of Animated Objects for Wallet Settings Items
export const walletSettingsItemAnimatedMap = walletSettingsItemAnimatedMapTemp;
export const walletSettingsItemHighlightMap = walletSettingsItemHighlightMapTemp;

// Settings Height Constants
export const SWITCH_WAIT_TIME_MS = 350;
export const CREATE_VAULT_HEADER_HEIGHT = 180;
export const SETTINGS_HEIGHT = 220.625;
export const NETWORK_LIST_HEIGHT = 180;

// Network List Settings Height Constants
export const CUSTOM_NETWORK_HEIGHT = 120;

// Settings Height Constants
export const IMPORT_VAULT_HEIGHT = 77.5;
export const EXPORT_VAULT_HEIGHT = 57;
export const SESSION_TIMEOUT_HEIGHT = 57;
export const EXPORT_SEED_WORDS_INPUT_HEIGHT = 57; // Add Appropiate height (When only the input field is shown)
export const EXPORT_SEED_WORDS_DISPLAY_HEIGHT = 57; // Add Appropiate height (When both input field and seed words is shown)
export const PRIVACY_MODE_HEIGHT = 57;

//Account Setting Height Constants
export const WALLET_SETTINGS_HEIGHT = 43.5 * 2;
export const EXPORT_PRIVATE_KEY_INPUT_HEIGHT = 57; // Add Appropiate height (When only the input field is shown)
export const EXPORT_PRIVATE_KEY_DISPLAY_HEIGHT = 57; // Add Appropiate height (When both input field and seed words is shown)
export const IMPORT_WALLET_KEYSTORE_HEIGHT = 131;
export const IMPORT_WALLET_PRIVATE_KEY_HEIGHT = 147;

// Wallet Settings Height Constants
export const WALLET_DROPDOWN_INPUT_HEIGHT = 57.5;
export const WALLET_DROPDOWN_ITEM_HEIGHT = 65;
export const WALLET_DROPDOWN_EMPTY_SEARCH_HEIGHT = 130;

// Reducer Constants
export const SHOW_SETTINGS = 'SHOW_SETTINGS';
export const TOGGLE_WALLET_DROPDOWN = 'TOGGLE_WALLET_DROPDOWN';
export const SHOW_WALLET_SETTINGS = 'SHOW_WALLET_SETTINGS';
export const TOGGLE_TOKEN_MARKET_DATA = 'TOGGLE_TOKEN_MARKET_DATA';

export function toggleShowSettings(data) {
  return {
    type: SHOW_SETTINGS,
    payload: data,
  };
}

export function toggleShowWalletSettings(data) {
  return {
    type: SHOW_WALLET_SETTINGS,
    payload: data,
  };
}

export function toggleWalletDropdown(data) {
  return {
    type: TOGGLE_WALLET_DROPDOWN,
    payload: data,
  };
}

export function toggleTokenMarketDetails(data) {
  return {
    type: TOGGLE_TOKEN_MARKET_DATA,
    payload: data,
  };
}

export const applicationAnimationToggles = [
  toggleShowSettings,
  toggleShowWalletSettings,
  toggleWalletDropdown,
  toggleTokenMarketDetails,
  showNetworks,
];
