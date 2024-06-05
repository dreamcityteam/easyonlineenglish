const REGEXP = {
  USERNAME: /^[a-zA-Z][a-zA-Z0-9_]{2,19}$/,
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_NUMBER: /^\+?\d{1,3}[- ]?\(?\d{1,3}\)?[- ]?\d{3,5}[- ]?\d{4}$/,
  NAME: /^([a-zA-Z\xC0-\xD6\xD8-\xF6\xF8-\xFF' -]){1,50}$/,
  LAST_NAME: /^([a-zA-Z\xC0-\xD6\xD8-\xF6\xF8-\xFF' -]){1,50}$/,
  PASSWORD: /^.{8,}$/
}

const ROLE = {
  ADMIN: 'ADMIN',
  STUDENT: 'STUDENT',
}

const HTTP_STATUS_CODES = {
  OK: 200,
  INTERNAL_SERVER_ERROR: 500,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  TEMPORARY_REDIRECT: 307,
}

const ENDPOINT = {
  AUTH: '/auth',
  LOG_OUT: '/logout',
  COURSES: '/courses',
  REGISTER: '/register',
  CONTANCT: '/contanct',
  COURSES_ID: '/student-course/:courseId',
  STUDENT_COURSE_PROGRESS: '/student-course-progress',
  STUDENT_COURSE_DEMO: '/student-course-demo',
  STUDENT_COURSES_DEMO: '/student-courses-demo',
  LIBRARY: '/library',
  STUDENT_UPDATE: '/student-update',
  SEND_EMAIL_RESET_PASSWORD: '/send-email-reset-password',
  RESET_PASSWORD: '/reset-password',
  RESET_PASSWORD_AUTH: '/reset-password-auth',
  AZUL_PAYMENT: '/azul-payment',
  STUDENT_TUTORIAL: '/tutorial'
}

const INITIAL_COURSE = {
  TITLE: 'Inglés Conversacional',
  DESCRIPTION: 'Nuestro curso online de inglés conversacional te brinda la oportunidad de mejorar tus habilidades de comunicación en inglés de manera efectiva y práctica. A través de lecciones interactivas y dinámicas, te sumergirás en situaciones cotidianas para aprender a expresarte con confianza.',
  PICTURE: 'https://easyonlineenglish.com/wp-content/uploads/2024/06/Square1.jpg'
}

module.exports = {
  HTTP_STATUS_CODES,
  ROLE,
  REGEXP,
  ENDPOINT,
  INITIAL_COURSE
}
