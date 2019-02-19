import CryptoJS from 'crypto-js';
import jc from 'json-cycle';
import { keccak512 } from 'js-sha3';
import moment from 'moment';
import _ from 'lodash';
import Wallet from '../apis/wallet/wallet';
import { getLocalStorage, setLocalStorage, sendMessage } from './browserService';
import config from '../app.config';
import { generateRandomSeed, getNextWallet } from '../apis/wallet/hdwallet';
import { setHashKey, decryptState } from '../utils/storage';

//decryption of  vault
async function decryptVault(vault, hashKey) {
  const cipher = jc.retrocycle(JSON.parse(vault));
  const bytes = CryptoJS.AES.decrypt(cipher, hashKey);
  const plaintext = bytes.toString(CryptoJS.enc.Utf8);
  vault = JSON.parse(plaintext);
  return vault;
}

async function decryptVaultFile(inputFile, hashKey, token) {
  const cipher = jc.retrocycle(JSON.parse(inputFile));
  const bytes = CryptoJS.AES.decrypt(cipher.content, hashKey);
  const plaintext = bytes.toString(CryptoJS.enc.Utf8);
  const vaultObj = JSON.parse(plaintext);
  //check for update password
  if (!token) {
    vaultObj.hashKey = hashKey;
  }
  if (!vaultObj.currentWallet) {
    const { wallets } = vaultObj;
    const currentWallet = wallets[0];
    vaultObj.currentWallet = currentWallet;
  }
  return vaultObj;
}

async function getLocalVault() {
  const localVault = await getLocalStorage('vault');
  return localVault.vault;
}

async function setLocalVault(vault, token) {
  //stored vault to localstorage
  const recipher = CryptoJS.AES.encrypt(JSON.stringify(vault), token);
  setLocalStorage('vault', JSON.stringify(jc.decycle(recipher)));
}
function createSeedWallet(vaultObj) {
  const keyPair = getNextWallet(vaultObj.hdwalletIndex + 1, vaultObj.seedWords);
  return new Wallet(keyPair.privateKey + keyPair.publicKey.substring(2, keyPair.publicKey.length));
}

export async function checkVault() {
  const localVault = await getLocalStorage('vault');
  return localVault.vault;
}

export async function createVault(hashKey, seedWords) {
  if (seedWords === undefined) {
    seedWords = generateRandomSeed();
  }
  const keyPair = getNextWallet(1, seedWords);
  setHashKey(hashKey);
  const updateKey = { result: 'updateKey', data: hashKey };
  await sendMessage(updateKey);
  const wallet = new Wallet(
    keyPair.privateKey + keyPair.publicKey.substring(2, keyPair.publicKey.length),
  );
  const walletData = wallet.currentWallet.wallet;
  const respWallet = {};
  respWallet.privateKey = walletData.privateKey;
  respWallet.address = walletData.address;
  respWallet.publicKey = walletData.publicKey === undefined ? undefined : walletData.publicKey;
  const vaultObj = {};
  vaultObj.wallets = [];
  respWallet.alias = `Wallet ${vaultObj.wallets.length + 1}`;
  vaultObj.currentWallet = respWallet;
  vaultObj.wallets.push(respWallet);
  vaultObj.seedWords = seedWords;
  vaultObj.derivationPath = '';
  vaultObj.hdwalletIndex = 1;
  const trxObj = {};
  trxObj[vaultObj.wallets[0].address] = [];
  await setLocalVault(vaultObj, hashKey);
  setLocalStorage('transactions', JSON.stringify(trxObj));
  return vaultObj;
}

export async function verify(hashKey) {
  const localVault = await getLocalStorage('vault');
  const vault = await decryptVault(localVault.vault, hashKey);
  return vault;
}

export async function changeCurrentWalletToVault(hashKey, currentWallet) {
  const localVault = await getLocalVault();
  const vaultObj = await decryptVault(localVault, hashKey);
  delete vaultObj.currentWallet;
  vaultObj.currentWallet = currentWallet;
  const cipher = CryptoJS.AES.encrypt(JSON.stringify(vaultObj), hashKey);
  setLocalStorage('vault', JSON.stringify(jc.decycle(cipher)));
}

export async function createWallet(
  hashKey,
  type,
  options = { privateKey: undefined, useSeedWords: false },
) {
  const localVault = await getLocalVault();
  const vaultObj = await decryptVault(localVault, hashKey);
  let wallet;
  if (options.useSeedWords === true) {
    wallet = createSeedWallet(vaultObj);
    vaultObj.hdwalletIndex += 1;
  } else if (options.privateKey !== undefined) {
    wallet = new Wallet(options.privateKey);
  } else {
    throw new Error('Must provide privateKey or useSeedWords option must be provided');
  }
  const walletData = wallet.currentWallet.wallet;
  const respWallet = {};
  respWallet.privateKey = walletData.privateKey;
  respWallet.address = walletData.address;
  respWallet.publicKey = walletData.pubKey === undefined ? undefined : walletData.pubKey;
  respWallet.alias = `Wallet ${vaultObj.wallets.length + 1}`;
  if (type === 'PrivateKeyBased') {
    respWallet.imported = true;
  }
  vaultObj.currentWallet = respWallet;
  vaultObj.wallets.push(respWallet);
  await setLocalVault(vaultObj, hashKey);
  // Get Transaction List from Local Storage
  const transactionsLocalStorageObj = await getLocalStorage('transactions');
  const transactions = JSON.parse(transactionsLocalStorageObj.transactions);
  // Push Empty Array into current wallet transactions List
  transactions[vaultObj.currentWallet.address] = [];
  // Store Transactions
  setLocalStorage('transactions', JSON.stringify(transactions));
  return vaultObj;
}

export async function exportVault(hashKey) {
  const obj = {};
  const localVault = await getLocalVault();
  const vault = await decryptVault(localVault, hashKey);
  delete vault.currentWallet;
  const updatedVault = JSON.stringify(vault);
  const encryptText = CryptoJS.AES.encrypt(updatedVault, hashKey);
  obj.content = encryptText;
  obj.version = config.vaultVersion;
  obj.timestamp = moment.utc().valueOf();
  return JSON.stringify(jc.decycle(obj));
}

export function getHashKey(password) {
  return keccak512(password);
}

async function storingVaultSettings(vaultObj, hashKey, token) {
  // store vault to local chrome storage
  await setLocalVault(vaultObj, hashKey);
  // store transactions to loal storage
  const trxObj = {};
  vaultObj.wallets.forEach(vo => {
    trxObj[vo.address] = [];
  });

  setLocalStorage('transactions', JSON.stringify(trxObj));

  if (!token) {
    //check for existing local hashkey
    const getKey = await sendMessage({ result: 'getKey' });
    if (getKey === undefined || getKey.data === undefined) {
      setHashKey(hashKey);
      const updateKey = { result: 'updateKey', data: hashKey };
      await sendMessage(updateKey);
    }
  }
}

function compareVault(vaultObj, vaultObjNew) {
  const pKeys = vaultObjNew.wallets.map(w => w.privateKey);
  const pKeysV = vaultObj.wallets.map(w => w.privateKey);
  const vaultDiff = _.differenceWith(pKeys, pKeysV, _.isEqual);
  if (vaultDiff.length === 0) {
    const result = {
      message: 'This vault already exists. Cannot overwrite',
      type: 'warning',
    };
    return result;
  }
  return vaultDiff;
}

async function mergeVault(vaultObj, vaultObjNew, token) {
  const vaultDiff = compareVault(vaultObj, vaultObjNew);
  if (vaultDiff.message !== undefined) return vaultDiff;

  vaultDiff.forEach(v => {
    vaultObjNew.wallets.forEach((vO, vOIndex) => {
      if (v === vO.privateKey) {
        //console.log('vW ', vW);
        vaultObj.wallets.forEach(vOV => {
          if (vO.alias.toUpperCase() === vOV.alias.toUpperCase()) {
            // console.log('vO ', vO);
            const myRe = /[-][0-9]+$/g;
            const myArray = myRe.exec(vOV.alias);
            // console.log(myArray);
            let index;
            let tempAlias;
            if (!myArray) {
              tempAlias = `${vaultObjNew.wallets[vOIndex].alias}-2`;
              // console.log(vaultObj.wallets[vOIndex]);
            } else {
              index = Number(vOV.alias.substr(myArray.index + 1, vOV.alias.length)) + 1;
              tempAlias = `${vaultObjNew.wallets[vOIndex].alias.substr(
                0,
                myArray.index + 1,
              )}${index}`;
            }
            vaultObjNew.wallets[vOIndex].alias = tempAlias;
            vaultObjNew.wallets.forEach((vObj, vObjIndex) => {
              if (vObjIndex > vOIndex && vOIndex !== vObjIndex && vObj.alias === tempAlias) {
                const vObjRe = /[-][0-9]+$/g;
                const myObjArray = vObjRe.exec(vObj.alias);
                // if (myObjArray) {
                index = Number(vObj.alias.substr(myObjArray.index + 1, vObj.alias.length)) + 1;
                tempAlias = `${vObj.alias.substr(0, myObjArray.index + 1)}${index}`;
                vaultObjNew.wallets[vObjIndex].alias = tempAlias;
                // }
              }
            });
          }
        });
      }
    });
  });

  // modify transactions in chrome local storage
  const value = await getLocalStorage('transactions');
  const txns = JSON.parse(value.transactions);
  vaultObjNew.wallets.forEach(vO => {
    txns[vO.address] = [];
  });
  // Merge With current Wallet
  vaultObjNew.wallets.forEach(wallet => {
    vaultObj.wallets.push(wallet);
  });
  await setLocalVault(vaultObj, token);
  setLocalStorage('transactions', JSON.stringify(txns));
  return vaultObj;
}

export async function importVaultService(inputFile, password, token) {
  const hashKey = getHashKey(password);
  let vaultObj;
  // check for existing vault
  const localVault = await checkVault();
  if (!localVault) {
    //create fresh new account and vault
    vaultObj = await decryptVaultFile(inputFile, hashKey, token);
    await storingVaultSettings(vaultObj, hashKey, token);
  } else {
    const vault = await decryptVault(localVault, token);
    const vaultObjNew = await decryptVaultFile(inputFile, hashKey, token);
    vaultObjNew.wallets.forEach((v, vindex) => {
      vaultObjNew.wallets[vindex].imported = true;
    });
    vaultObj = await mergeVault(vault, vaultObjNew, token);
  }
  return vaultObj;
}

export async function signInService(password) {
  const decState = await getLocalStorage('state');
  const encryptedVault = await getLocalVault();
  const hashKey = getHashKey(password);
  const decryptedVault = await decryptVault(encryptedVault, hashKey);
  decryptedVault.hashKey = hashKey;
  setHashKey(decryptedVault.hashKey);
  const updateKey = { result: 'updateKey', data: decryptedVault.hashKey };
  await sendMessage(updateKey);
  const state = await decryptState(decState.state);
  return state;
}

export async function updateVault(wallets, token) {
  //only use for rename wallet alias name
  const encryptedVault = await getLocalVault();
  const decryptedVault = await decryptVault(encryptedVault, token);
  decryptedVault.wallets = wallets;
  // update current wallet
  decryptedVault.wallets.forEach(w => {
    if (decryptedVault.currentWallet && w.privateKey === decryptedVault.currentWallet.privateKey) {
      decryptedVault.currentWallet = w;
    }
  });
  await setLocalVault(decryptedVault, token);
}

export async function storeHashKeyToHandleSeedWords(password) {
  const hashKey = getHashKey(password);
  setHashKey(hashKey);
  const updateKey = { result: 'updateKey', data: hashKey };
  await sendMessage(updateKey);
}
