// import extension from 'extensionizer';
import { getExtension } from '../../app/services/extensionService';

let isProviderEnabled = false;
// let currentAddress = [];
let privacyEnabled = false;
const extension = getExtension();

extension.runtime.onMessage.addListener(
  /*eslint-disable no-unused-vars*/ (request, sender, sendResponse) => {
    if (request.type && request.type === 'FROM_EXTENSION') {
      if (request.initial_state) {
        privacyEnabled = request.initial_state.data.privacyModeEnabled;
        //   currentAddress = request.initial_state.data.address;
        if (privacyEnabled && !isProviderEnabled) {
          request.initial_state.data.address = [];
        }
        delete request.initial_state.data.privacyModeEnabled;
      } else if (request.current_wallet) {
        //  currentAddress = request.current_wallet.data;
        if (privacyEnabled && !isProviderEnabled) {
          request.current_wallet.data = [];
        }
      } else if (request.connect_privacy) {
        isProviderEnabled = true;
      }
      window.postMessage(request, '*');
    }
  },
);

window.addEventListener('message', event => {
  // We only accept messages from ourselves
  if (event.source !== window) return;
  if (event.data.type && event.data.type === 'FROM_PAGE') {
    switch (event.data.func) {
      case 'eth_sendTransaction':
      case 'eth_signTransaction':
      case 'eth_sign':
      case 'initial_state':
      case 'eth_accounts':
      case 'privacy':
        extension.runtime.sendMessage(event.data);
        break;
      default:
    }
  }
});

/**
 * URL of AIWA chrome extension : chrome-extension://lcglkgfbloafchfmmghhgkpanbdicnfp/
 * console.log(`URL of AIWA chrome extension : ${extension.extension.getURL('')}`);
 */

function injectScript(filePath) {
  const script = document.createElement('script');
  script.setAttribute('type', 'text/javascript');
  script.setAttribute('src', filePath);
  document.documentElement.appendChild(script);
}

if (process.env.NODE_ENV === 'production') {
  const url = extension.extension.getURL('js/contentScript.bundle.js');
  injectScript(url);
} else {
  injectScript('https://localhost:3000/js/contentScript.bundle.js');
}
