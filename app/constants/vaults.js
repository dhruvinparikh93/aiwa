export const SAVE_VAULT = 'SAVE_VAULT';
export const UPDATE_ADDRESS_BOOK = 'UPDATE_ADDRESS_BOOK';
export const UPDATE_ADDRESS_DIALOG = 'UPDATE_ADDRESS_DIALOG';

export const INVALID_FILE_STRINGS = [
  'Invalid file. Are you sure this is a vault?',
  'You done goofed. Definetly an invalid file. 😑',
  'Not this again... 😒',
  'Are you being paid to be this stupid?',
  "Okay, that's it. No more importing for you!",
];

export function updateAddressBook(data) {
  return {
    type: UPDATE_ADDRESS_BOOK,
    payload: data,
  };
}

export function saveVault(_vault) {
  return {
    type: SAVE_VAULT,
    payload: _vault,
  };
}

export function updateAddressDialog(data) {
  return {
    type: UPDATE_ADDRESS_DIALOG,
    payload: data,
  };
}
