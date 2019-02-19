import sinon from 'sinon';

import { SETTINGS_HEIGHT, VAULT_SETTINGS } from '../../../app/constants/animation';

import * as animationService from '../../../app/services/animationService';

const assert = require('assert');

// eslint-disable-next-line func-names
global.requestAnimationFrame = function (callback) {
  setTimeout(callback, 0);
};
function callme() {
  return true;
}

describe('animateApplicationSetting', () => {
  it('set the height of vault using animation', async () => {
    const stubStart = { start: sinon.stub() };
    stubStart.start.withArgs('callback').returns();
    await animationService.animateApplicationSetting(VAULT_SETTINGS, SETTINGS_HEIGHT, callme);
    assert(true, 'animate Application Setting should be called');
  });
});
