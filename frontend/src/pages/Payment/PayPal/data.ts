const INITIAL_OPTION: {
  clientId: string;
  'enable-funding': string;
  'disable-funding': string;
  'data-sdk-integration-source': string;
} = {
  clientId: 'AYI9-L4AkMZxI8Y943sNuRfDxf7s9QpTmDoTa5-5HbGpndbjHsU9C28rT86MzsAkVs_rG9h8fB0s2-Lo',
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
