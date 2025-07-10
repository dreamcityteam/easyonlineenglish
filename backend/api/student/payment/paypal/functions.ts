const axios = require('axios');
import { PAYMENT_METHOD } from './data';

export type Plan = 1 | 2 | 3;

export const getPayPalRequestId = (): string =>
  `plan-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;

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

export const createProduct = async (plan: Plan) => {
  const accessToken = await generateAccessToken();

  const response = await axios.post(
    process.env.PAYPAL_BASE_URL + `/v1/catalogs/products`,
    {
      name: 'EASY ONLY ENGLISH | plan',
      description: PAYMENT_METHOD[plan].DESCRIPTION,
      type: 'SERVICE',
      category: 'EDUCATIONAL_AND_TEXTBOOKS',
      image_url: 'https://example.com/streaming.jpg',
      home_url: 'https://easyonlineenglish.com/'
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'PayPal-Request-Id': getPayPalRequestId()
      }
    }
  );

  return response;
}

export const createBillingPlan = async (plan: Plan, requestId: string) => {
  const accessToken = await generateAccessToken();
  const isYear = plan === 2;
  const interval_unit = isYear ? 'YEAR' : 'MONTH';
  const interval_count = isYear ? 1 : PAYMENT_METHOD[plan].DURATION_IN_MONTHS;

  const response = await axios.post(
    process.env.PAYPAL_BASE_URL + `/v1/billing/plans`,
    {
      product_id: requestId,
      name: 'Easy Online English | billing',
      description: PAYMENT_METHOD[plan].DESCRIPTION,
      billing_cycles: [
        {
          frequency: {
            interval_unit,
            interval_count
          },
          tenure_type: 'REGULAR',
          sequence: 1,
          total_cycles: 0,
          pricing_scheme: {
            fixed_price: {
              value: PAYMENT_METHOD[plan].AMOUNT,
              currency_code: 'USD'
            }
          }
        }
      ],

      payment_preferences: {
        auto_bill_outstanding: true,
        setup_fee_failure_action: 'CONTINUE',
        payment_failure_threshold: 3,
      },

      taxes: {
        percentage: '0',
        inclusive: false
      }
    },
    {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'PayPal-Request-Id': getPayPalRequestId()
      }
    }
  );

  return response;
};

export const createSubscription = async (planId: string) => {
  const accessToken = await generateAccessToken();

  const response = await axios.post(
    process.env.PAYPAL_BASE_URL + '/v1/billing/subscriptions',
    {
      plan_id: planId,
      application_context: {
        brand_name: 'manfra.io',
        return_url: `${process.env.PAYPAL_BASE_URL_RETURN}/payment`,
        cancel_url: `${process.env.PAYPAL_BASE_URL_RETURN}/courses`,
        user_action: 'SUBSCRIBE_NOW'
      }
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    }
  );

  const subscription = response.data;

  const approveLink = subscription.links.find((link: any) => link.rel === 'approve');

  return {
    id: subscription.id,
    status: subscription.status,
    approveUrl: approveLink?.href
  };
};


export const captureSubscription = async (subscriptionId: string) => {
  const accessToken = await generateAccessToken();

  const response = await axios.get(
    `${process.env.PAYPAL_BASE_URL}/v1/billing/subscriptions/${subscriptionId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    }
  );

  return response.data;
};


export const countMounts = (countMount: number): Date => {
  const nuevaFecha: Date = new Date();
  nuevaFecha.setMonth(nuevaFecha.getMonth() + countMount);
  return nuevaFecha;
}

export const isPlan = (plan: string): boolean =>
  ['1', '2', '3'].includes(plan);
