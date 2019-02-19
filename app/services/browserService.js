import { isFirefox } from './extensionService';

export function getLocalStorage(name) {
  return new Promise((resolve, reject) => {
    if (isFirefox()) {
      browser.storage.local.get([name]).then(
        response => {
          resolve(response);
        },
        error => {
          reject(error);
        },
      );
    } else {
      chrome.storage.local.get(name, value => {
        try {
          resolve(value);
        } catch (error) {
          reject(error);
        }
      });
    }
  });
}

export function setLocalStorage(name, value) {
  return new Promise((resolve, reject) => {
    try {
      if (isFirefox()) {
        browser.storage.local.set({ [name]: value }).then(
          response => {
            if (!response) {
              resolve(1);
            }
          },
          error => {
            throw new Error(error);
          },
        );
      } else {
        chrome.storage.local.set({ [name]: value });
        resolve(1);
      }
    } catch (error) {
      reject(error);
    }
  });
}

export function removeLocalStorage(name) {
  return new Promise((resolve, reject) => {
    try {
      if (isFirefox()) {
        browser.storage.local.remove(name).then(
          response => {
            if (!response) {
              resolve(1);
            }
          },
          error => {
            throw new Error(error);
          },
        );
      } else {
        chrome.storage.local.remove(name);
        resolve(1);
      }
    } catch (error) {
      reject(error);
    }
  });
}

export function removeAllLocalAppStorage(keys) {
  return new Promise((resolve, reject) => {
    try {
      if (isFirefox()) {
        browser.storage.local.remove(keys).then(
          response => {
            if (!response) {
              resolve(1);
            }
          },
          error => {
            throw new Error(error);
          },
        );
      } else {
        chrome.storage.local.remove(keys);
        resolve(1);
      }
    } catch (error) {
      reject(error);
    }
  });
}

export function getBadgeText() {
  return new Promise((resolve, reject) => {
    try {
      if (isFirefox()) {
        browser.browserAction.getBadgeText({}).then(
          text => {
            resolve(text);
          },
          error => {
            throw new Error(error);
          },
        );
      } else {
        chrome.browserAction.getBadgeText({}, result => {
          resolve(result);
        });
      }
    } catch (error) {
      reject(error);
    }
  });
}

export function setBadgeText(txt) {
  return new Promise((resolve, reject) => {
    try {
      if (isFirefox()) {
        browser.browserAction.setBadgeText({ text: txt }).then(
          response => {
            if (!response) {
              resolve(1);
            }
          },
          error => {
            throw new Error(error);
          },
        );
      } else {
        chrome.browserAction.setBadgeText({ text: txt });
        resolve(1);
      }
    } catch (error) {
      reject(error);
    }
  });
}

export function sendMessage(obj) {
  return new Promise((resolve, reject) => {
    try {
      if (isFirefox()) {
        browser.runtime.sendMessage(obj).then(
          response => {
            resolve(response);
          },
          error => {
            reject(error);
          },
        );
      } else {
        chrome.runtime.sendMessage(obj, response => {
          if (response) {
            resolve(response);
          }
        });
      }
    } catch (e) {
      reject(chrome.runtime.lastError);
    }
  });
}

export function createOSNotification(id, message) {
  return new Promise((resolve, reject) => {
    try {
      const obj = {
        type: 'basic',
        iconUrl: 'img/icon-32.png',
        title: 'AIWA',
        message,
        priority: 0,
      };
      if (isFirefox()) {
        browser.notifications.create(id, obj).then(
          response => {
            resolve(response);
          },
          error => {
            reject(error);
          },
        );
      } else {
        chrome.notifications.create(id, obj, id => {
          if (id) {
            resolve(id);
          }
          reject(new Error('Error creating notification'));
        });
      }
    } catch (e) {
      reject(chrome.runtime.lastError);
    }
  });
}
