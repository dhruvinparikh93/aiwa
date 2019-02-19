export const SIGN_MESSAGE_DETAILS = 'SIGN_MESSAGE_DETAILS';

export function signMessageDetails(data) {
  return {
    type: SIGN_MESSAGE_DETAILS,
    payload: data,
  };
}
