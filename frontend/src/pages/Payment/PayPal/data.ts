import { isDev } from '../../../tools/function';

const INITIAL_OPTION: {
  clientId: any;
  'enable-funding': string;
  'disable-funding'?: string;
  'data-sdk-integration-source': string;
} = {
  clientId: isDev() ? (process.env.PAYPAL_CLIENT_ID_DEV?.trim()) : (process.env.PAYPAL_CLIENT_ID?.trim()),
  "enable-funding": "card",
  'data-sdk-integration-source': 'integrationbuilder_sc',
};

export {
  INITIAL_OPTION,
}
