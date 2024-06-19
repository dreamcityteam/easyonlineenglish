const { PAYPAL_API } = require('./const');
const { PAYMENT_METHOD } = require('../../tools/const');
const { isDev } = require('../../tools/functions');

const handleResponse = async (response) => {
  try {
    const jsonResponse = await response.json();
    return {
      jsonResponse,
      httpStatusCode: response.status,
    };
  } catch (err) {
    const errorMessage = await response.text();
    throw new Error(errorMessage);
  }
}

const generateAccessToken = async () => {
  const {
    PAYPAL_CLIENT_ID,
    PAYPAL_CLIENT_ID_DEV,
    PAYPAL_CLIENT_SECRET,
    PAYPAL_CLIENT_SECRET_DEV,
  } = process.env;

  const CLIENT_ID = isDev() ? PAYPAL_CLIENT_ID_DEV : PAYPAL_CLIENT_ID;
  const SECRET = isDev() ? PAYPAL_CLIENT_SECRET_DEV : PAYPAL_CLIENT_SECRET;

  try {
    if (!CLIENT_ID || !SECRET) {
      throw new Error('MISSING_API_CREDENTIALS');
    }

    const auth = Buffer.from(`${CLIENT_ID}:${SECRET}`).toString('base64');
    const fetch = (await import('node-fetch')).default;

    const response = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
      method: 'POST',
      body: 'grant_type=client_credentials',
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Failed to generate Access Token:', error);
  }
};

const createOrder = async (paymentMethod) => {
  if (!(Number(paymentMethod) > 0 && Number(paymentMethod) <= 3)) {
    throw new Error('Invalid payment method.');
  }

  const accessToken = await generateAccessToken();
  const url = `${PAYPAL_API}/v2/checkout/orders`;
  const payload = {
    intent: 'CAPTURE',
    purchase_units: [
      {
        amount: {
          currency_code: 'USD',
          value: `${PAYMENT_METHOD[paymentMethod].AMOUNT}.00`,
        },
      },
    ],
  };

  const fetch = (await import('node-fetch')).default;

  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    method: 'POST',
    body: JSON.stringify(payload),
  });

  return handleResponse(response);
};

const captureOrder = async (orderID) => {
  const accessToken = await generateAccessToken();
  const url = `${PAYPAL_API}/v2/checkout/orders/${orderID}/capture`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return handleResponse(response);
};

module.exports = {
  createOrder,
  captureOrder
}
