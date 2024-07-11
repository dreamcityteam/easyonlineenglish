const { isDev } = require('../../tools/functions');

const PAYPAL_API = `https://api-m.${isDev() ? 'sandbox.' : ''}paypal.com`;

module.exports = {
  PAYPAL_API
}
