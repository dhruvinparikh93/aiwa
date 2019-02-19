import {
  UPDATE_TOKEN_LIST,
  CHANGE_SELECTED_TOKEN,
  UPDATE_ADD_TOKEN_SUGGESTION,
} from '../constants/tokens';

const initialState = {
  tokenList: {},
  selectedToken: undefined,
  suggestAddToken: false,
};

const tokens = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_TOKEN_LIST:
      return { ...state, tokenList: action.payload };
    case CHANGE_SELECTED_TOKEN:
      return { ...state, selectedToken: action.payload };
    case UPDATE_ADD_TOKEN_SUGGESTION:
      return { ...state, suggestAddToken: action.payload };
    default:
      return state;
  }
};

export default tokens;
