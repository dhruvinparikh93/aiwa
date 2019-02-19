import { SIGN_MESSAGE_DETAILS } from '../constants/message';

const initialState = {
  msgDetails: undefined,
};

const message = (state = initialState, action) => {
  switch (action.type) {
    case SIGN_MESSAGE_DETAILS:
      return {
        ...state,
        msgDetails: action.payload,
      };
    default:
      return state;
  }
};

export default message;
