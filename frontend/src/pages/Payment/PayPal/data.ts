const isDev =  false;

const INITIAL_OPTION: {
  clientId: string;
  'enable-funding': string;
  'disable-funding': string;
  'data-sdk-integration-source': string;
} = {
  clientId: (isDev ? process.env.PAYPAL_CLIENT_ID_DEV : process.env.PAYPAL_CLIENT_ID) || '',
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
