import { generateRandomSeed, getNextWallet } from '../../../../app/apis/wallet/hdwallet';

const assert = require('assert');

describe('AionHDWallet', () => {
  describe('#generateRandomSeed', () => {
    it('should be able to generate random seed', () => {
      const seedWords = generateRandomSeed();
      assert(seedWords.split(' ').length === 12);
    });
  });
});

describe('AionHDWallet', () => {
  describe('#getNextWallet', () => {
    it('should be able to generate multiple accounts with same seed', () => {
      const seedWords = 'consider faculty friend chalk uphold gesture endless pond discover neglect company furnace';

      const keySet1 = getNextWallet(1, seedWords);
      const keySet2 = getNextWallet(2, seedWords);

      assert.equal(
        keySet1.privateKey,
        '0xda4603fc1f0865935f77db472a7d810bda701032af4ab59ae618011a16bb8504',
      );
      assert.equal(
        keySet1.publicKey,
        '0x9aa5ed068cb7524009c20a6c16c489d7dbb0053d48cfca8fd9fff8761e6cadb8',
      );

      assert.equal(keySet1.privateKey.length, 2 + 64);
      assert.equal(keySet1.publicKey.length, 2 + 64);

      assert.equal(
        keySet2.privateKey,
        '0xc90d99548baae8613d5c739a741916777ce68998ed0413a8da443f0cdfbd13da',
      );
      assert.equal(
        keySet2.publicKey,
        '0x1e54db736e7eff89f7314c33c76707447d1b030ffcb52280f8f8f6c16a2913e1',
      );

      assert.equal(keySet2.privateKey.length, 2 + 64);
      assert.equal(keySet2.publicKey.length, 2 + 64);
    });
  });
});
