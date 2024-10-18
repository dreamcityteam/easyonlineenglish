import { ObjectValuValidator, Role, StatusCode } from './type';

const VALIDATOR: ObjectValuValidator = {
  USERNAME: {
    message: 'Ingresa un nombre de usuario válido.',
    regExp: /^[a-zA-Z][a-zA-Z0-9_]{2,19}$/
  },
  EMAIL: {
    message: 'Ingresa una dirección de correo electrónico válida.',
    regExp: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  PHONE_NUMBER: {
    message: 'Ingresa un número de teléfono válido.',
    regExp: /^\+?\d{1,3}[- ]?\(?\d{1,3}\)?[- ]?\d{3,5}[- ]?\d{4}$/
  },
  NAME: {
    message: 'Ingresa un nombre válido.',
    regExp: /^([a-zA-Z\xC0-\xD6\xD8-\xF6\xF8-\xFF' -]){1,50}$/
  },
  LAST_NAME: {
    message: 'Ingresa un apellido válido.',
    regExp: /^([a-zA-Z\xC0-\xD6\xD8-\xF6\xF8-\xFF' -]){1,50}$/
  },
  PASSWORD: {
    message: 'Tu contraseña debe tener al menos 8 caracteres.',
    regExp: /^.{8,}$/
  },
};

const ROLE: Role = {
  ADMIN: 'ADMIN',
  STUDENT: 'STUDENT',
  FREE: 'FREE',
};

const HTTP_STATUS_CODES: StatusCode = {
  OK: 200,
  INTERNAL_SERVER_ERROR: 500,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  TEMPORARY_REDIRECT: 307,
};

const AUTH_TOKEN: 'AUTH_TOKEN' = 'AUTH_TOKEN';
const TUTORIAL: 'TUTORIAL' = 'TUTORIAL';
const DEFAULT_PHOTO: string = 'https://secure.gravatar.com/avatar/3b314b13ca2c8ed3a56da2620bb25ff4?s=150&d=mm&r=g';

const PAYMENT_METHOD: {
  [key: number]: {
    DURATION_IN_MONTHS: number;
    AMOUNT: number;
    DESCRIPTION: string;
  }
} = {
  1: {
    DURATION_IN_MONTHS: 1,
    AMOUNT: 13,
    DESCRIPTION: 'MEMBRESÍA POR 1 MES'
  },

  2: {
    DURATION_IN_MONTHS: 12,
    AMOUNT: 130,
    DESCRIPTION: 'MEMBRESÍA POR 1 AÑO'
  },

  3: {
    DURATION_IN_MONTHS: 3,
    AMOUNT: 35,
    DESCRIPTION: 'MEMBRESÍA POR 3 MES'
  }
};

export {
  VALIDATOR,
  ROLE,
  HTTP_STATUS_CODES,
  AUTH_TOKEN,
  DEFAULT_PHOTO,
  TUTORIAL,
  PAYMENT_METHOD,
}