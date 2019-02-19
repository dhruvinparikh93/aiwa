import { SAVE_VAULT, UPDATE_ADDRESS_BOOK, UPDATE_ADDRESS_DIALOG } from '../constants/vaults';

const initialState = {
  vault: undefined,
  toastOptions: null,
  addressBook: [],
  openAddressDialog: undefined,
};

const vaults = (state = initialState, action) => {
  switch (action.type) {
    case SAVE_VAULT:
      return { ...state, vault: action.payload };
    case UPDATE_ADDRESS_BOOK:
      return { ...state, addressBook: action.payload };
    case UPDATE_ADDRESS_DIALOG:
      return { ...state, openAddressDialog: action.payload };
    default:
      return state;
  }
};

export default vaults;
