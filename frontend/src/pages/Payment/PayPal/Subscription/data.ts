import { isDev } from '../../../../tools/function';

/**
 * PayPal SDK configuration options for subscription payments
 * Simplified configuration matching the working single payment component
 */
const INITIAL_OPTION: {
  clientId: any;
  'enable-funding': string;
  'disable-funding'?: string;
  'data-sdk-integration-source': string;
  intent: string;
  vault?: boolean;
} = {
  // Use environment-specific client ID (same as working component)
  clientId: isDev()
    ? (process.env.PAYPAL_CLIENT_ID_DEV?.trim())
    : (process.env.PAYPAL_CLIENT_ID?.trim()),

  // Enable card payments for subscriptions
  'enable-funding': 'card',

  // Integration source for tracking
  'data-sdk-integration-source': 'integrationbuilder_sc',

  // Subscription intent for recurring payments
  intent: 'subscription',

  // Enable vaulting for subscription payments
  vault: true
};

/**
 * Validates that required PayPal configuration is present
 * @returns {boolean} True if configuration is valid
 */
const validatePayPalConfig = (): boolean => {
  const clientId = INITIAL_OPTION.clientId;

  if (!clientId || clientId.length === 0) {
    console.error('PayPal Client ID is missing. Please check environment variables.');
    return false;
  }

  return true;
};

export {
  INITIAL_OPTION,
  validatePayPalConfig,
}
