const axios = require('axios');
import { PAYMENT_METHOD } from './data';

export const generateAccessToken = async () => {
  const response = await axios({
    url: process.env.PAYPAL_BASE_URL + '/v1/oauth2/token',
    method: 'post',
    data: 'grant_type=client_credentials',
    auth: {
      username: process.env.PAYPAL_CLIENT_ID,
      password: process.env.PAYPAL_CLIENT_SECRET
    }
  });

  return response.data.access_token;
}

export const createOrder = async (plan: 1 | 2 | 3) => {
  const accessToken = await generateAccessToken();

  const response = await axios({
    url: process.env.PAYPAL_BASE_URL + '/v2/checkout/orders',
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + accessToken
    },
    data: JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: [
        {
          items: [
            {
              name: PAYMENT_METHOD[plan].DESCRIPTION,
              description: 'Aprende Inglés como Segunda Lengua - Easy Online English.',
              quantity: 1,
              unit_amount: {
                currency_code: 'USD',
                value: PAYMENT_METHOD[plan].AMOUNT
              }
            }
          ],

          amount: {
            currency_code: 'USD',
            value: PAYMENT_METHOD[plan].AMOUNT,
            breakdown: {
              item_total: {
                currency_code: 'USD',
                value: PAYMENT_METHOD[plan].AMOUNT
              }
            }
          }
        }
      ],

      application_context: {
        return_url: `${process.env.PAYPAL_BASE_URL_RETURN}/payment`,
        cancel_url: `${process.env.PAYPAL_BASE_URL_RETURN}/courses`,
        shipping_preference: 'NO_SHIPPING',
        user_action: 'PAY_NOW',
        brand_name: 'manfra.io'
      }
    })
  }).catch((error: any) => console.log(error.response.data));


  return response?.data || {};
}

export const capturePayment = async (orderId: number) => {
  const accessToken = await generateAccessToken();

  const response = await axios({
    url: process.env.PAYPAL_BASE_URL + `/v2/checkout/orders/${orderId}/capture`,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + accessToken
    }
  });

  return response?.data || {};
}

export const countMounts = (countMount: number): Date => {
  const nuevaFecha: Date = new Date();
  nuevaFecha.setMonth(nuevaFecha.getMonth() + countMount);
  return nuevaFecha;
}

export const isPlan = (plan: string): boolean =>
  ['1', '2', '3'].includes(plan);
