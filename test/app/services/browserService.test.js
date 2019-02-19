import * as browserService from '../../../app/services/browserService';

const chrome = require('sinon-chrome/extensions');
const browser = require('sinon-chrome/webextensions');

const assert = require('assert');

describe('Browser Service', () => {
  describe('getLocalStorage', () => {
    before(() => {
      global.chrome = chrome;
      global.browser = browser;
    });
    it('should return local storage value', async () => {
      chrome.storage.local.get.yields({
        foo: 'bar',
      });
      await browserService.getLocalStorage('foo');
      assert.ok(chrome.storage.local.get.calledOnce, 'storage.local.get should be called');
      chrome.flush();
    });
  });
  describe('setLocalStorage', () => {
    before(() => {
      global.chrome = chrome;
    });
    it('should set local storage', async () => {
      await browserService.setLocalStorage('foo', 'bar');
      assert.ok(chrome.storage.local.set.calledOnce, 'storage.local.set should be called');
      chrome.flush();
    });
  });
  describe('removeLocalStorage', () => {
    before(() => {
      global.chrome = chrome;
    });
    it('should remove storage', async () => {
      await browserService.removeLocalStorage('foo');
      assert.ok(chrome.storage.local.remove.calledOnce, 'storage.local.remove should be called');
      chrome.flush();
    });
  });
  describe('removeAllLocalAppStorage', () => {
    before(() => {
      global.chrome = chrome;
    });
    it('should remove all storage', async () => {
      await browserService.removeAllLocalAppStorage(['foo']);
      assert.ok(chrome.storage.local.remove.calledOnce, 'storage.local.remove should be called');
      chrome.flush();
    });
  });
  describe('getBadgeText', () => {
    before(() => {
      global.chrome = chrome;
    });
    it('should get badge text', async () => {
      chrome.browserAction.getBadgeText.yields('badge text');
      await browserService.getBadgeText();
      assert.ok(
        chrome.browserAction.getBadgeText.calledOnce,
        'browserAction.getBadgeText should be called',
      );
      chrome.flush();
    });
  });
  describe('setBadgeText', () => {
    before(() => {
      global.chrome = chrome;
    });
    it('should set badge text', async () => {
      await browserService.setBadgeText('text');
      assert.ok(
        chrome.browserAction.setBadgeText.calledOnce,
        'browserAction.setBadgeText should be called',
      );
      chrome.flush();
    });
  });
  describe('sendMessage', () => {
    before(() => {
      global.chrome = chrome;
    });
    it('should send message', async () => {
      chrome.runtime.sendMessage.yields({ foo: 'bar' });
      await browserService.sendMessage({});
      assert.ok(chrome.runtime.sendMessage.calledOnce, 'runtime.sendMessage should be called');
      chrome.flush();
    });
  });
});
