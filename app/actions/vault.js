import { updateWalletList, changeCurrentWallet } from '../constants/wallets';
import { updateToken, updateTimeout } from '../constants/common';
import { importVaultService, signInService } from '../services/vaultService';
import { hydrateApp } from '../constants/hydrate';
import { updateAddressBook } from '../constants/vaults';
import { createToast } from '../constants/toast';

export function addContactToAddressBook(address, alias, addressBook) {
  return dispatch => {
    // Add contact
    const contact = { address, alias };
    addressBook.push(contact);

    // Dispatch
    dispatch(updateAddressBook(addressBook));
    dispatch(
      createToast({
        message: `${alias} successfully added to address book.`,
        type: 'success',
      }),
    );
  };
}

export function deleteContactFromAddressBook(address, addressBook) {
  return dispatch => {
    // Check if contact is in address book
    const contactExist = addressBook.filter(contact => contact.address === address);
    if (contactExist === undefined || contactExist.length === 0) {
      dispatch(
        createToast({
          message: `${address} not found.`,
          type: 'info',
        }),
      );
    } else {
      // Remove Contact
      addressBook.splice(addressBook.indexOf(x => x.address === contactExist[0].address), 1);

      // Dispatch
      dispatch(updateAddressBook(addressBook));
      dispatch(
        createToast({
          message: `${contactExist[0].alias} has been successfully removed.`,
          type: 'success',
        }),
      );
    }
  };
}

export function setTimeout(sessionTimeoutStr) {
  return async dispatch => {
    try {
      let sessionTimeout = parseInt(sessionTimeoutStr, 10);

      if (sessionTimeout <= 30 && sessionTimeout > 0) {
        sessionTimeout = 30;
      }
      if (sessionTimeout <= 0 || sessionTimeout > 99999999) {
        // once user enter 0 or negative we set session for unlimited time
        //  this is maximum limit supported by react-idle library which we use
        //  to set  session timeout unlimited is approx 3 years.
        sessionTimeout = 99999999;
      }
      //convert into miliseconds
      sessionTimeout *= 1000;
      dispatch(updateTimeout(sessionTimeout));
    } catch (error) {
      throw error;
    }
  };
}

export function importVault(input, password, token) {
  return async dispatch => {
    try {
      const vault = await importVaultService(input, password, token);

      dispatch(updateWalletList(vault.wallets));
      if (vault.currentWallet) {
        dispatch(changeCurrentWallet(vault.currentWallet));
      }
      if (!token) {
        dispatch(updateToken(vault.hashKey));
      }

      return vault;
    } catch (error) {
      throw error;
    }
  };
}

export function signIn(password) {
  return async dispatch => {
    try {
      const state = await signInService(password);
      // Hydrate state
      dispatch(hydrateApp(state));
      return true;
    } catch (error) {
      return false;
    }
  };
}
