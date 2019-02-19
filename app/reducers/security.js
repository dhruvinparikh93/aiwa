import {
  TOGGLE_PRIVACY_MODE,
  CONNECT_REQUEST_DETAILS,
  ADD_WHITE_LISTED_DAPP,
} from '../constants/security';

const initialState = {
  privacyModeEnabled: false,
  connectRequestDetails: undefined,
  whiteListedDApp: [],
};

const security = (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_PRIVACY_MODE:
      return { ...state, privacyModeEnabled: action.payload };
    case CONNECT_REQUEST_DETAILS:
      return { ...state, connectRequestDetails: action.payload };
    case ADD_WHITE_LISTED_DAPP:
      return { ...state, whiteListedDApp: action.payload };
    default:
      return state;
  }
};

export default security;
