// Import Validators
import validator from 'validator';
import BigNumber from 'bignumber.js';
import { isFirefox } from '../../services/extensionService';
import { convertNanoAmpToAion } from '../../services/numberFormatter';
import bip0039WordList from '../../constants/bip0039';

// Declare Custom Validation methods
const passwordMatch = (confirmation, state) => state.password === confirmation;

// Address Validation
const isValidAddress = address => /^0x[0-9a-fA-F]{64}$/.test(address);

const isValidAddressForSendToken = (address, state) => {
  if (validator.isEmpty(address) && state.amount !== '') {
    return false;
  }
  if (validator.isEmpty(address) && state.amount === '') {
    return true;
  }

  return isValidAddress(address);
};

const isValidAddressForAddToken = address => {
  if (validator.isEmpty(address)) {
    return true;
  }

  return isValidAddress(address);
};

// Private Key Validation
const isValidPrivateKey = privateKey => /[0-9a-fA-F]{128}$/.test(privateKey);

// Import Wallet Validation Methods
const validPrivateKey = (privateKey, state) => {
  if (validator.isEmpty(privateKey) && !state.submitted) {
    return true;
  }

  return isValidPrivateKey(privateKey);
};

const isKeystorePasswordEmpty = (keystorePassword, state) => {
  if (!state.submitted) return false;

  if (state.keystoreFileName === '' && keystorePassword === '') {
    return false;
  }

  return validator.isEmpty(keystorePassword);
};

const validKeystoreFile = (keystoreFileName, state) => {
  if (keystoreFileName === '' && state.keystorePassword !== '') {
    return true;
  }

  if (keystoreFileName === '') {
    return false;
  }

  return false;
};

// Valid Custom URL
const isValidCustomURL = url => {
  if (url.match(/localhost/)) return true;

  return validator.isURL(url);
};

const isValidURLScheme = url => {
  if (url.match('https://')) return true;
  if (!isFirefox()) {
    if (url.match('http://')) return true;
  }
  return false;
};

const customNetworkUrlErrorMsg = () => {
  let msg = 'Please enter http:// or https:// scheme.';
  if (isFirefox()) {
    msg = 'Please enter https:// scheme.';
  }
  return msg;
};
// Send Token Amount Validation
const validAmount = amount => {
  if (amount === '-') return false;
  return amount === '' || !Number.isNaN(amount);
};

const validGranularity = (amount, state) => {
  const { selectedToken } = state;

  if (validator.isEmpty(amount)) return true;

  if (selectedToken.address !== 'none') {
    const amountBN = BigNumber(amount);
    const granularityBN = BigNumber(selectedToken.granularity);
    const valid = amountBN
      .dividedBy(granularityBN)
      .multipliedBy(granularityBN)
      .isEqualTo(amountBN);

    if (valid) return true;
    return false;
  }

  return true;
};

const validDecimals = amount => {
  if (amount) {
    return amount.split('.')[1] ? amount.split('.')[1].length <= 18 : true;
  }
  return true;
};

const scientificNotation = amount => {
  const match = `${amount}`.match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
  if (!match) {
    return 0;
  }
  const valid = Math.max(0, (match[1] ? match[1].length : 0) - (match[2] ? +match[2] : 0));
  return valid ? valid <= 18 : true;
};

const greaterThanBalance = (amount, state) => {
  if (amount !== undefined && amount !== '') {
    return new BigNumber(amount).lte(new BigNumber(state.balanceAmount));
  }
  return true;
};

const validNRGLimit = (amount, state) => {
  if (state.totalNrg !== undefined) {
    const nrgAmptoAion = convertNanoAmpToAion(state.totalNrg);
    let bnAIONBalance = new BigNumber(state.aionCoin.balance.amount);
    if (state.selectedToken.id === 'aion') {
      const bnAmt = new BigNumber(state.amount);
      bnAIONBalance = new BigNumber(state.aionCoin.balance.amount).minus(bnAmt);
    }
    return nrgAmptoAion.lte(bnAIONBalance);
  }
  return true;
};

const greaterThanZero = amount => Number(amount) >= 0;

// Send Token Hex Data String Validation
const isHexString = value => {
  if (validator.isEmpty(value)) return true;

  if (typeof value !== 'string' || !value.match(/^0x[0-9A-Fa-f]*$/) || value === '0x') {
    return false;
  }
  return true;
};

// Seed Phrase Length Validator
const validSeedPhraseLength = (seedPhraseString, state) => {
  const seedPhraseArr = seedPhraseString.split(' ');

  if (!state.submitted) {
    return true;
  }

  if (seedPhraseArr.length < 12 || seedPhraseArr.length > 12 || seedPhraseArr.length !== 12) {
    return false;
  }

  return true;
};

// Valid Seed Phrase
const validSeedPhrase = (_, state) => {
  if (state.seedWords === '') {
    return true;
  }

  /*eslint-disable no-use-before-define*/
  const invalidSeedPhrasesArr = validatonObj.importSeedPhraseValidation[1].invalidSeedPhrases;
  const seedPhraseArr = state.seedWords
    .trim()
    .replace(/\n/g, ' ')
    .split(' ');

  if (state.keyCode === 32 || state.keyCode === 8 || state.keyCode === 13 || state.pastedData) {
    seedPhraseArr.forEach(seedPhrase => {
      if (bip0039WordList.indexOf(seedPhrase) === -1) {
        if (invalidSeedPhrasesArr.indexOf(seedPhrase) === -1) {
          invalidSeedPhrasesArr.push(seedPhrase);
        }
      }
    });

    /*eslint-disable no-use-before-define*/
    validatonObj.importSeedPhraseValidation[1].invalidSeedPhrases = invalidSeedPhrasesArr;
  }

  invalidSeedPhrasesArr.forEach((invalidSeedPhrase, index) => {
    if (seedPhraseArr.indexOf(invalidSeedPhrase) === -1) {
      invalidSeedPhrasesArr.splice(index, 1);
    }
  });

  if (invalidSeedPhrasesArr.length > 0) {
    return false;
  }

  return true;
};

const validatonObj = {
  createVaultValidation: [
    {
      field: 'password',
      method: validator.isEmpty,
      validWhen: false,
      message: 'Password is required.',
    },
    {
      field: 'confirmPassword',
      method: validator.isEmpty,
      validWhen: false,
      message: 'Password confirmation is required.',
    },
    {
      field: 'confirmPassword',
      method: passwordMatch,
      validWhen: true,
      message: 'Password and password confirmation do not match.',
    },
  ],
  importSeedPhraseValidation: [
    {
      field: 'seedWords',
      method: validSeedPhraseLength,
      validWhen: true,
      message: 'Seed phrases require 12 words.',
    },
    {
      field: 'invalidSeedPhrases',
      method: validSeedPhrase,
      validWhen: true,
      message: 'The highlighted words are not valid seed words.',
      invalidSeedPhrases: [],
    },
  ],
  sendTokenValidation: [
    {
      field: 'from',
      method: isValidAddressForSendToken,
      validWhen: true,
      message: 'Invalid address.',
    },
    {
      field: 'to',
      method: isValidAddressForSendToken,
      validWhen: true,
      message: 'Invalid address.',
    },
    {
      field: 'amount',
      method: greaterThanZero,
      validWhen: true,
      message: 'Invalid amount.',
    },
    {
      field: 'amount',
      method: validDecimals,
      validWhen: true,
      message: 'Invalid amount.',
    },
    {
      field: 'amount',
      method: scientificNotation,
      validWhen: true,
      message: 'Invalid amount.',
    },
    {
      field: 'amount',
      method: greaterThanBalance,
      validWhen: true,
      message: 'Insufficient amount in wallet.',
    },
    {
      field: 'nrgLimit',
      method: validNRGLimit,
      validWhen: true,
      message: 'Some AION is required to cover NRG costs.',
    },
    {
      field: 'amount',
      method: validGranularity,
      validWhen: true,
      message: 'Invalid amount. Must be a multiple of tokens granularity',
    },
    {
      field: 'amount',
      method: validAmount,
      validWhen: true,
      message: 'Invalid amount.',
    },
    {
      field: 'hexData',
      method: isHexString,
      validWhen: true,
      message: 'Invalid hex string.',
    },
  ],
  sendTokenFromDAppValidation: [
    {
      field: 'amount',
      method: greaterThanZero,
      validWhen: true,
      message: 'Invalid amount.',
    },
    {
      field: 'amount',
      method: validDecimals,
      validWhen: true,
      message: 'Invalid amount.',
    },
    {
      field: 'amount',
      method: scientificNotation,
      validWhen: true,
      message: 'Invalid amount.',
    },
    {
      field: 'amount',
      method: greaterThanBalance,
      validWhen: true,
      message: 'Insufficient amount in wallet.',
    },
    {
      field: 'amount',
      method: validGranularity,
      validWhen: true,
      message: 'Invalid amount. Must be a multiple of tokens granularity',
    },
    {
      field: 'amount',
      method: validAmount,
      validWhen: true,
      message: 'Invalid amount.',
    },
    {
      field: 'nrgLimit',
      method: validNRGLimit,
      validWhen: true,
      message: 'Some AION is required to cover NRG costs.',
    },
  ],
  customNetworkValidation: [
    {
      field: 'url',
      method: validator.isEmpty,
      validWhen: false,
      message: 'URL is required.',
    },
    {
      field: 'url',
      method: isValidCustomURL,
      validWhen: true,
      message: 'Invalid URL.',
    },
    {
      field: 'url',
      method: isValidURLScheme,
      validWhen: true,
      message: customNetworkUrlErrorMsg(),
    },

    {
      field: 'port',
      method: validator.isEmpty,
      validWhen: false,
      message: 'Port is required.',
    },
    {
      field: 'port',
      method: validator.isPort,
      validWhen: true,
      message: 'Port should not be greater than 65535.',
    },
  ],
  importWallet: [
    {
      field: 'privateKey',
      method: validator.isEmpty,
      validWhen: false,
      message: 'Private key is required.',
    },
    {
      field: 'privateKey',
      method: isValidPrivateKey,
      validWhen: true,
      message: 'Invalid private key.',
    },
  ],
  importWalletDropdown: [
    {
      field: 'privateKeyInput',
      method: validPrivateKey,
      validWhen: true,
      message: 'Invalid private key.',
    },
    {
      field: 'keystorePassword',
      method: isKeystorePasswordEmpty,
      validWhen: false,
      message: 'Password is required.',
    },
    {
      field: 'keystoreFileName',
      method: validKeystoreFile,
      validWhen: false,
      message: 'File is required.',
    },
  ],
  sessionTimeout: [
    {
      field: 'timeout',
      method: validator.isEmpty,
      validWhen: false,
      message: 'Timeout is required.',
    },
    {
      field: 'timeout',
      method: validator.isNumeric,
      validWhen: true,
      message: 'Invalid Session Timeout.',
    },
  ],
  addTokenValidation: [
    {
      field: 'address',
      method: isValidAddressForAddToken,
      validWhen: true,
      message: 'Invalid address.',
    },
  ],
  importVaultOnboarding: [
    {
      field: 'importVaultOnboardingPassword',
      method: validator.isEmpty,
      validWhen: false,
      message: 'Password is required.',
    },
    {
      field: 'importVaultOnboardingFileName',
      method: validator.isEmpty,
      validWhen: false,
      message: ' File is required.',
    },
  ],
};

export default validatonObj;
