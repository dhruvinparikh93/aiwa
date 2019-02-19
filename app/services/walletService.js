import { createWallet } from './vaultService';
import { decode } from './importExportService';
import Wallet from '../apis/wallet/wallet';

export const shortenAddress = address => `${address.slice(0, 6)}...${address.substr(address.length - 4)}`;

export function removeZeroX(data) {
  return data.slice(0, 2) === '0x' ? data.slice(2, data.length) : data;
}

export function addZeroX(data) {
  return data.slice(0, 2) !== '0x' ? `0x${data}` : data;
}

export const getWalletAlias = (walletArr, addressToLookup) => {
  const walletFound = walletArr.find(wallet => wallet.address === addressToLookup);

  return walletFound === undefined ? 'Unknown Contact' : walletFound.alias;
};

export async function getDecryptedWalletData(keystoreFileData, password) {
  let privateKey;
  try {
    const importedWallet = await Wallet.fromV3(keystoreFileData, password);
    privateKey = importedWallet.privateKey.trim();
  } catch (err) {
    try {
      const web3Keystore = decode(keystoreFileData);
      const importedWeb3Wallet = await Wallet.decrypt(web3Keystore, password);
      privateKey = importedWeb3Wallet.privateKey.trim();
    } catch (err) {
      throw err;
    }
  }
  return privateKey;
}

export async function importWallet(importType, importData, hashKey, currentWallets, password) {
  let privateKey;
  try {
    if (importType === 'keystoreFile') {
      privateKey = await getDecryptedWalletData(importData, password);
    } else {
      privateKey = importData.trim();
    }

    // check for already existing  wallets
    const existingWallets = currentWallets.filter(
      w => w.privateKey === privateKey || w.privateKey === `0x${privateKey}`,
    );
    if (existingWallets.length > 0) {
      // return existingWallets;
      return;
    }

    // Don't change the varaible name of  privateKey
    privateKey = addZeroX(privateKey);

    const vault = await createWallet(hashKey, 'PrivateKeyBased', {
      privateKey,
    });

    return vault;
  } catch (err) {
    throw err;
  }
}

export function renameWallet(value, currentWallet, currenIndex, walletArr) {
  const valueIndex = walletArr.findIndex(wallet => value === wallet.alias);
  const walletIndex = walletArr.findIndex(wallet => currentWallet.address === wallet.address);

  if (value.length < 1) {
    throw new Error('Wallet name must be at least 1 character long.');
  }

  if (value.length > 16) {
    throw new Error('Wallet name can not exceed 16 characters.');
  }

  if (valueIndex !== -1 && valueIndex !== currenIndex) {
    throw new Error(`"${value}" already exists.`);
  }

  if (valueIndex === currenIndex) {
    return undefined;
  }

  const walletToEdit = {
    ...currentWallet,
    alias: value,
  };

  // Remove Current Wallet from array
  walletArr.splice(walletIndex, 1, walletToEdit);

  return walletArr;
}
