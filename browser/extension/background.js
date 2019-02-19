import bluebird from 'bluebird';
import { viewTransaction } from '../../app/actions/transaction';
import { getHashKey, setHashKey } from './background/passwordStorage';
import { getExtension } from '../../app/services/extensionService';
import { AION_NETWORK_LIST } from '../../app/constants/networks';
import { setLocalStorage, getLocalStorage } from '../../app/services/browserService';
import { ONBOARDING_PAGES_GROUP } from '../../app/constants/navigation';

const extension = getExtension();
const AIWA_CONFIG_STORAGE_KEY = 'aiwa_config';
const DAPP_STORAGE_KEY = 'popupContent';
let windowId;
let tabId;
let res = {};
let currentAddress = [];
global.Promise = bluebird;
function promisifier(method) {
  // return a function
  return function promisified(...args) {
    // which returns a promise
    return new Promise(resolve => {
      args.push(resolve);
      method.apply(this, args);
    });
  };
}

function promisifyAll(obj, list) {
  list.forEach(api => bluebird.promisifyAll(obj[api], { promisifier }));
}

// let chrome extension api support Promise
promisifyAll(chrome, ['tabs', 'windows', 'browserAction', 'contextMenus']);
promisifyAll(chrome.storage, ['local']);

require('./background/inject');

// on first install, open a new window to AION website

extension.runtime.onInstalled.addListener(() => {
  setLocalStorage(
    AIWA_CONFIG_STORAGE_KEY,
    JSON.stringify({
      currentNetwork: AION_NETWORK_LIST[1].networkFullUrl,
      currentWallet: [],
      privacyModeEnabled: false,
      pageStatus: ONBOARDING_PAGES_GROUP[0],
      whiteListedDApp: [],
    }),
  );
  extension.tabs.create({
    url: 'https://getaiwa.com',
  });
});

// Persist initial state
async function getStateFromStorage() {
  const value = await getLocalStorage(AIWA_CONFIG_STORAGE_KEY);
  return JSON.parse(value.aiwa_config);
}

async function isValidDApp(origin) {
  // check here for whitelisted url using storage.
  if (origin) {
    const { whiteListedDApp } = await getStateFromStorage();
    if (whiteListedDApp.length > 0) {
      const position = whiteListedDApp.indexOf(origin);
      return position > -1;
    }
  }
  return false;
}

async function getInitialState() {
  let address = [];
  const {
    currentNetwork: network,
    currentWallet,
    pageStatus,
    privacyModeEnabled,
  } = await getStateFromStorage();
  if (ONBOARDING_PAGES_GROUP.indexOf(pageStatus) === -1) {
    if (privacyModeEnabled) {
      return {
        address,
        network,
        privacyModeEnabled,
      };
    }
    currentAddress = currentWallet;
    address = currentAddress;
  }
  return {
    address,
    network,
    privacyModeEnabled,
  };
}

async function openWindow(key, request) {
  await setLocalStorage(key, request);
  extension.windows.create(
    {
      url: 'window.html',
      type: 'popup', //"normal", "popup", or "panel",
      height: 625,
      width: 370,
    },
    details => {
      windowId = details.id;
    },
  );
}

async function triggerUI(sender, request) {
  tabId = sender.tab.id;
  if (!windowId) {
    request.info.title = sender.tab.title;
    request.info.favIconUrl = sender.tab.favIconUrl;
    const { origin } = request.info;
    const isValid = await isValidDApp(origin);
    if (request.func === 'privacy' && isValid && currentAddress.length !== 0) {
      res = { type: 'FROM_EXTENSION', cancel: false, connect_privacy: { data: currentAddress } };
      extension.tabs.sendMessage(tabId, res);
    } else {
      await openWindow(DAPP_STORAGE_KEY, JSON.stringify(request));
    }
  } else {
    res = {
      cancel: true,
      message: 'Previous request approval is pending',
      type: 'FROM_EXTENSION',
    };
    extension.tabs.sendMessage(tabId, res);
  }
}

extension.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  // Extension to Content Script
  const senderURL = sender.url;
  const popupURL = extension.extension.getURL('popup.html');
  const windowURL = extension.extension.getURL('window.html');
  const senderId = sender.id;
  const extensionId = extension.runtime.id;
  if (senderId === extensionId) {
    if (senderURL === popupURL || senderURL === windowURL) {
      res = {};
      const switchKey = request.result;
      switch (switchKey) {
        case 'signed': {
          res = request.data;
          res.type = 'FROM_EXTENSION';
          res.cancel = false;
          extension.tabs.sendMessage(tabId, res);
          extension.windows.remove(windowId);
          windowId = undefined;
          break;
        }
        case 'cancel-sign': {
          res = request.data;
          res.type = 'FROM_EXTENSION';
          res.cancel = true;
          extension.tabs.sendMessage(tabId, res);
          extension.windows.remove(windowId);
          windowId = undefined;
          break;
        }
        case 'send': {
          res.type = 'FROM_EXTENSION';
          res.cancel = false;
          res.data = request.data;
          extension.tabs.sendMessage(tabId, res);
          extension.windows.remove(windowId);
          windowId = undefined;
          break;
        }
        case 'cancel-send': {
          res = request.data;
          res.type = 'FROM_EXTENSION';
          res.cancel = true;
          extension.tabs.sendMessage(tabId, res);
          extension.windows.remove(windowId);
          windowId = undefined;
          break;
        }
        case 'connect_privacy': {
          res.type = 'FROM_EXTENSION';
          res.cancel = false;
          res.connect_privacy = { data: currentAddress };
          extension.tabs.sendMessage(tabId, res);
          extension.windows.remove(windowId);
          windowId = undefined;
          break;
        }
        case 'cancel_privacy': {
          res = request.data;
          res.type = 'FROM_EXTENSION';
          res.cancel = true;
          extension.tabs.sendMessage(tabId, res);
          extension.windows.remove(windowId);
          windowId = undefined;
          break;
        }
        case 'current_network': {
          extension.tabs.query({ currentWindow: true }, tabs => {
            if (tabs) {
              tabs.forEach(tab => {
                extension.tabs.sendMessage(tab.id, {
                  type: 'FROM_EXTENSION',
                  cancel: false,
                  current_network: request,
                });
              });
            }
          });
          break;
        }
        case 'current_wallet': {
          currentAddress = request.data;
          extension.tabs.query({ currentWindow: true }, tabs => {
            if (tabs) {
              tabs.forEach(tab => {
                extension.tabs.sendMessage(tab.id, {
                  type: 'FROM_EXTENSION',
                  cancel: false,
                  current_wallet: request,
                });
              });
            }
          });
          break;
        }
        case 'updateKey': {
          setHashKey(request.data);
          sendResponse({ type: 'updateKey', data: 'done' });
          break;
        }
        case 'getKey': {
          const hashKey = getHashKey();
          sendResponse({ type: 'getKey', data: hashKey });
          break;
        }
        default:
      }
    } else {
      // Content script to Extension
      switch (request.func) {
        case 'eth_signTransaction':
        case 'eth_sendTransaction':
        case 'eth_sign':
        case 'eth_accounts':
        case 'privacy':
          await triggerUI(sender, request);
          break;
        case 'initial_state': {
          const { address, network, privacyModeEnabled } = await getInitialState();
          extension.tabs.query({ active: true, currentWindow: true }, tabs => {
            if (tabs) {
              extension.tabs.sendMessage(tabs[0].id, {
                type: 'FROM_EXTENSION',
                cancel: false,
                initial_state: {
                  data: {
                    address,
                    network,
                    privacyModeEnabled,
                  },
                },
              });
            }
          });
          break;
        }
        default:
      }
    }
  }
});

/* Respond to the user's clicking one of the buttons */
/* As buttons are not supported in notifications for firefox, we need to do same on click for notifications, so for now
   we can off this event(commented), once support is available we can switch here.
extension.notifications.onButtonClicked.addListener(async (notifId, btnIdx) => {
  if (notifId === 'trxalert') {
    if (btnIdx === 0) {
      const data = await viewTransaction();
      extension.tabs.create({
        url: data,
      });
    }
  }
});
*/

extension.notifications.onClicked.addListener(async notifId => {
  if (notifId === 'trxalert') {
    const data = await viewTransaction();
    extension.tabs.create({
      url: data,
    });
  }
});
