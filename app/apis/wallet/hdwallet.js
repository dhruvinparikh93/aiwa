const bip39 = require('bip39');
const crypto = require('crypto');
const { derivePath, getPublicKey } = require('ed25519-hd-key');

function takeOutInitialZeros(str) {
  if (str !== undefined && str.startsWith('00')) {
    return str.substring(2, str.length);
  }

  throw new Error('Invalid input.');
}

export const generateRandomSeed = () => {
  const randomBytes = crypto.randomBytes(16);
  const mnemonic = bip39.entropyToMnemonic(randomBytes.toString('hex'));
  return mnemonic;
};

/**
 * Pass *index* as no of wallets created plus one
 * @param {index} index
 * @param {mnemonic words} seedWords
 */
export const getNextWallet = (index, seedWords) => {
  if (index < 1) throw Error('index must be 1 to any numeric value');
  if (seedWords === undefined) throw Error('seedWords must be specified');

  const seed = bip39.mnemonicToSeed(seedWords).toString('hex');

  const adjustedIndex = index - 1; //derived paths are index based

  const derivationPath = `m/44'/425'/0'/0'/${adjustedIndex}'`;

  const { key, chainCode } = derivePath(derivationPath, seed);

  if (key === undefined || chainCode === undefined) {
    throw new Error('Could not generate wallet with seed words');
  }

  const rawPublicKey = getPublicKey(key).toString('hex');
  const privateKey = `0x${key.toString('hex')}`;
  const publicKey = `0x${takeOutInitialZeros(rawPublicKey)}`;
  return { privateKey, publicKey };
};

// const { key, chainCode } = derivePath("m/44'/425'/0'/0'/0'", seed);
// console.log(`seedWords => ${mnemonic}`);
// console.log(`Public Key => ${getPublicKey(key).toString('hex')}`);
// console.log(`Private Key => ${key.toString('hex')}`);
