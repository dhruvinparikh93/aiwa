import * as extensionService from '../../../app/services/extensionService';

const chrome = require('sinon-chrome/extensions');
const browser = require('sinon-chrome/webextensions');
const assert = require('assert');

describe('getExtension', () => {
  before(() => {
    global.chrome = chrome;
    global.browser = browser;
  });
  it('get the Extension', () => {
    const output = extensionService.getExtension();
    assert.equal(output, chrome, 'Output should be as expected');
  });
});

describe('isFirefox', () => {
  it('check the browser', () => {
    const output = extensionService.isFirefox();
    assert.equal(output, false, 'Output should be as expected');
  });
});
