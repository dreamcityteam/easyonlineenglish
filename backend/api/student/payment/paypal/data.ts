export type TPaymentMethod = {
  DURATION_IN_MONTHS: number;
  AMOUNT: string;
  DESCRIPTION: string;
}

export const PAYMENT_METHOD: { [key: string]: TPaymentMethod; } = {
  1: {
    DURATION_IN_MONTHS: 1,
    AMOUNT: '12.99',
    DESCRIPTION: 'MEMBRESÍA POR 1 MES'
  },

  2: {
    DURATION_IN_MONTHS: 12,
    AMOUNT: '129.99',
    DESCRIPTION: 'MEMBRESÍA POR 1 AÑO'
  },

  3: {
    DURATION_IN_MONTHS: 3,
    AMOUNT: '34.99',
    DESCRIPTION: 'MEMBRESÍA POR 3 MES'
  }
}
