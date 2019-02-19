import { getExtension } from '../../../app/services/extensionService';
import {
  startBackgroundTransactionChecker,
  isBackgroundTransactionCheckerStarted,
} from './backgroundTransactionChecker';

const extension = getExtension();
const injectCode = {
  code: `var injected = window.aionweb3;
    window.aionweb3 = true;
    injected;`,
  runAt: 'document_start',
};

function isInjected(tabId) {
  if (typeof browser === 'undefined') {
    //chrome
    return extension.tabs.executeScriptAsync(tabId, injectCode);
  }
  //firefox
  return extension.tabs.executeScript(tabId, injectCode);
}

function loadScript(name, tabId, cb) {
  if (process.env.NODE_ENV === 'production') {
    extension.tabs.executeScript(
      tabId,
      { file: `/js/${name}.bundle.js`, runAt: 'document_end' },
      cb,
    );
  } else {
    // dev: async fetch bundle
    fetch(`https://localhost:3000/js/${name}.bundle.js`)
      .then(res => res.text())
      .then(fetchRes => {
        // Load redux-devtools-extension inject bundle,
        // because inject script and page is in a different context
        const request = new XMLHttpRequest();
        request.open(
          'GET',
          'chrome-extension://lmhkpmbekcpmknklioeibfkpmmfibljd/js/redux-devtools-extension.js',
        ); // sync
        request.send();
        request.onload = () => {
          if (request.readyState === XMLHttpRequest.DONE && request.status === 200) {
            extension.tabs.executeScript(tabId, {
              code: request.responseText,
              runAt: 'document_start',
            });
          }
        };
        extension.tabs.executeScript(tabId, { code: fetchRes, runAt: 'document_end' });
      });
  }

  // inject transaction status checker only if not started
  if (!isBackgroundTransactionCheckerStarted()) {
    startBackgroundTransactionChecker();
  }
}

const arrowURLs = [
  '^(http://www.|https://www.|http://|https://)?[a-z0-9]+([-.]{1}[a-z0-9]+)*.[a-z]{2,5}(:[0-9]{1,5})?(/.*)?$',
];

extension.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  /*
   * tabId =. 29 ,
   * changeInfo => {"status":"complete"},
   * tab => {
   * "active":true,"audible":false,"autoDiscardable":true,"discarded":false,
   * "favIconUrl":"https://www.google.ca/images/branding/product/ico/googleg_lodp.ico","height":728,
   * "highlighted":true,"id":29,"incognito":false,"index":5,
   * "mutedInfo":{"muted":false},"pinned":false,"selected":true,"status":"complete",
   * "title":"Google",
   * "url":"https://www.google.ca/","width":1536,"windowId":1
   * }
   *
   * console.log(
   * `tabId = ${tabId}, changeInfo => ${JSON.stringify(changeInfo)}, tab => ${JSON.stringify(tab)}`
   * );
   **/

  if (changeInfo.status !== 'loading' || !tab.url.match(arrowURLs.join('|'))) return;

  const result = await isInjected(tabId);
  if (extension.runtime.lastError || result[0]) return;
  // chrome.windows.create({
  //   url: 'window.html',
  //   type: 'popup',
  //   height: 700,
  //   width: 300,
  // });

  /*eslint-disable no-console*/
  loadScript('inject', tabId, () => console.log('load inject bundle success!'));
});
