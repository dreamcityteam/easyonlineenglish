import { HttpStatusCodes, ObjectValueString, Messages, Roles, Validators } from './type';

const ROLE: Roles = {
  ADMIN: 'ADMIN',
  STUDENT: 'STUDENT',
  FREE: 'FREE'
};

const HTTP_STATUS_CODES: HttpStatusCodes = {
  OK: 200,
  CREATED: 201,
  INTERNAL_SERVER_ERROR: 500,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  CONFLICT: 409,
  TEMPORARY_REDIRECT: 307,
};

const ENDPOINT: ObjectValueString = {
  AUTH: 'auth',
  SING_UP: 'sign-up',
  SING_UP_GOOGLE: 'sign-up-google',
  SING_IN_GOOGLE: 'login-google',
  SING_OUT: 'sign-out',
  LOGIN: 'login',
  SEARCH_WORD: 'search-word',
  UPDATE_WORD: 'update-word',
  CREATE_WORD: 'create-word',
  ADMIN_UPDATE_LESSON_ORDER: 'admin-update-lesson-order',
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
  PAYPAL_CREATE_SUBCRIPTION: 'paypal-create-subscription',
  PAYPAL_CAPTURE_SUBCRIPTION: 'paypal-capture-subscription',

  LIBRARY: 'library',
  SEND_EMAIL_RESET_PASSWORD: 'send-email-reset-password',
  RESET_PASSWORD: 'reset-password',
  RESET_PASSWORD_AUTH: 'reset-password-auth',
  AZUL_PAYMENT: 'azul-payment',
  STUDENT_TUTORIAL: 'tutorial',
  PAYPAL_CREATE_ORDER: 'paypal-create-order',
  PAYPAL_COMPLETED_ORDER: 'paypal-completed-order',

  STUDENT_DELETE_ACCOUNT: 'student-delete-account',

  SUSCRIBETE: 'suscribete',
  UPLOAD_FILE: 'upload-file',
};

const VALIDATOR: Validators = {
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

const MESSAGE: Messages = {
  SUCCESSFUL: 'Successful!'
};

const INITIAL_COURSE = {
  TITLE: 'Inglés Conversacional',
  DESCRIPTION: 'Nuestro curso online de inglés conversacional te brinda la oportunidad de mejorar tus habilidades de comunicación en inglés de manera efectiva y práctica. A través de lecciones interactivas y dinámicas, te sumergirás en situaciones cotidianas para aprender a expresarte con confianza.',
  PICTURE: 'https://coachingresourcecenter.com/wp-content/uploads/easyonlineenglish/2024/06/Square1-500x311.jpg'
};

export {
  ROLE,
  HTTP_STATUS_CODES,
  ENDPOINT,
  VALIDATOR,
  MESSAGE,
  INITIAL_COURSE
};
