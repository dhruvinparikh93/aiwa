import Accounts from 'aion-keystore';
import AionWallet from '../../../../app/apis/wallet/aionwallet';

const assert = require('assert');

describe('AionWallet', () => {
  describe('#constructor', () => {
    it('should not fail with empty private key', () => {
      const accs = new Accounts();
      const acc = accs.create();

      const aionWallet = new AionWallet(acc.privateKey);

      assert.equal(acc.address, aionWallet.getCurrentAddress());
    });
  });
});
