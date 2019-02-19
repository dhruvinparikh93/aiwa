const isFirefox = () => process.env.BROWSER === 'firefox';

const getExtension = () => (isFirefox() ? browser : chrome);

module.exports = {
  getExtension,
  isFirefox,
};
