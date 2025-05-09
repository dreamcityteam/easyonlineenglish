import { isDev } from '../../../tools/function';

const INITIAL_OPTION: {
  clientId: any;
  'enable-funding': string;
  'disable-funding': string;
  'data-sdk-integration-source': string;
} = {
  clientId: isDev() ? (process.env.PAYPAL_CLIENT_ID_DEV?.trim()) : (process.env.PAYPAL_CLIENT_ID?.trim()),
  'enable-funding': 'paylater',
  'disable-funding': 'card',
  'data-sdk-integration-source': 'integrationbuilder_sc',
};

const STATUS_PAYPAL: {
  COMPLETED: 'COMPLETED';
  INSTRUMENT_DECLINED: 'INSTRUMENT_DECLINED';
} = {
  COMPLETED: 'COMPLETED',
  INSTRUMENT_DECLINED: 'INSTRUMENT_DECLINED'
}

export {
  INITIAL_OPTION,
  STATUS_PAYPAL
}
