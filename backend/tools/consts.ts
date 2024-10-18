import { ObjectValueNumber, ObjectValueString, ObjectValuValidator } from './type';

const ROLE: ObjectValueString = {
  ADMIN: 'ADMIN',
  STUDENT: 'STUDENT',
};

const HTTP_STATUS_CODES: ObjectValueNumber = {
  OK: 200,
  INTERNAL_SERVER_ERROR: 500,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  TEMPORARY_REDIRECT: 307,
};

const ENDPOINT: ObjectValueString = {
  AUTH: 'auth',
  SING_UP: 'sign-up',
  SING_UP_GOOGLE: 'sign-up-google',
  LOGIN_GOOGLE: 'login-google',
  SING_OUT: 'sign-out',
  LOGIN: 'login',

  // code refactoring
  CONTANCT: 'contanct',

  STUDENT_COURSE: 'student-course/:courseId',
  STUDENT_COURSES: 'courses',
  STUDENT_COURSES_DEMO: 'student-courses-demo',
  STUDENT_COURSE_PROGRESS: 'student-course-progress',
  STUDENT_COURSE_DEMO: 'student-course-demo',
  STUDENT_SENTENCE: 'student-sentence',
  STUDENT_PHOTO: 'student-photo',
  STUDENT_INVOICE: 'student-invoice',
  STUDENT_TERMS: 'student-terms',
  STUDENT_ACTIVE_ACCOUNT: 'student-active-account',
  STUDENT_UPDATE: 'student-update',
  STUDENT_RATING: 'student-rating',

  AZUL_PAYMENT_3DS: 'azul-payment-3ds',


  LIBRARY: 'library',
  SEND_EMAIL_RESET_PASSWORD: 'send-email-reset-password',
  RESET_PASSWORD: 'reset-password',
  RESET_PASSWORD_AUTH: 'reset-password-auth',
  AZUL_PAYMENT: 'azul-payment',
  STUDENT_TUTORIAL: 'tutorial',
  PAYPAL: 'paypal',
 
  STUDENT_DELETE_ACCOUNT: 'student-delete-account',
  SUSCRIBETE: 'suscribete',
  UPLOAD_FILE: 'upload-file',
};

const VALIDATOR: ObjectValuValidator = {
  USERNAME: {
    message: 'Please enter a valid username.',
    regExp: /^[a-zA-Z][a-zA-Z0-9_]{2,19}$/
  },
  EMAIL: {
    message: 'Please enter a valid email address.',
    regExp: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  PHONE_NUMBER: {
    message: 'Please enter a valid phone number.',
    regExp: /^\+?\d{1,3}[- ]?\(?\d{1,3}\)?[- ]?\d{3,5}[- ]?\d{4}$/
  },
  NAME: {
    message: 'Please enter a valid name.',
    regExp: /^([a-zA-Z\xC0-\xD6\xD8-\xF6\xF8-\xFF' -]){1,50}$/
  },
  LAST_NAME: {
    message: 'Please enter a valid last name.',
    regExp: /^([a-zA-Z\xC0-\xD6\xD8-\xF6\xF8-\xFF' -]){1,50}$/
  },
  PASSWORD: {
    message: 'Your password must be at least 8 characters long.',
    regExp: /^.{8,}$/
  },
};

const MESSAGE = {
  SUCCESSFUL: 'Successful!'
};

const INITIAL_COURSE = {
  TITLE: 'Inglés Conversacional',
  DESCRIPTION: 'Nuestro curso online de inglés conversacional te brinda la oportunidad de mejorar tus habilidades de comunicación en inglés de manera efectiva y práctica. A través de lecciones interactivas y dinámicas, te sumergirás en situaciones cotidianas para aprender a expresarte con confianza.',
  PICTURE: 'https://coachingresourcecenter.com/wp-content/uploads/easyonlineenglish/2024/06/Square1-500x311.jpg'
};

const PAYMENT_METHOD = {
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
  ROLE,
  HTTP_STATUS_CODES,
  ENDPOINT,
  VALIDATOR,
  MESSAGE,
  INITIAL_COURSE,
  PAYMENT_METHOD
};
