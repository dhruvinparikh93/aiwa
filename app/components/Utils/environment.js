import { WINDOW, POPUP, NOTIFICATION } from '../../constants/environment';

const getEnvironmentType = (url = window.location.href) => {
  if (url.match(/popup.html(?:#.*)*$/)) {
    return POPUP;
  }
  if (url.match(/window.html(?:\?.+)*$/) || url.match(/window.html(?:#.*)*$/)) {
    return WINDOW;
  }
  return NOTIFICATION;
};

export default getEnvironmentType;
