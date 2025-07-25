import { ENDPOINT } from '../../tools/consts';

const avoidTokenEndpoints: string[] = [
  ENDPOINT.CONTANCT,
  ENDPOINT.SUSCRIBETE,
  ENDPOINT.LOGIN,
  ENDPOINT.SING_UP,
  ENDPOINT.SING_UP_GOOGLE,
  ENDPOINT.SING_IN_GOOGLE,
];

const tokenFromHeaderEndpoints: string[] = [
  ENDPOINT.RESET_PASSWORD_AUTH,
  ENDPOINT.RESET_PASSWORD,
  ENDPOINT.STUDENT_ACTIVE_ACCOUNT,
];

const tokenFromCookieEndpoints: string[] = [
  ENDPOINT.AUTH,
  ENDPOINT.SING_OUT,
  ENDPOINT.STUDENT_COURSES,
  ENDPOINT.STUDENT_COURSE_PROGRESS,
  ENDPOINT.STUDENT_SENTENCE,
  ENDPOINT.STUDENT_INVOICE,
  ENDPOINT.STUDENT_UPDATE,
  ENDPOINT.STUDENT_TERMS,
  ENDPOINT.LIBRARY,
  ENDPOINT.AZUL_PAYMENT,
  ENDPOINT.STUDENT_TUTORIAL,
  ENDPOINT.PAYPAL_CREATE_ORDER,
  ENDPOINT.PAYPAL_COMPLETED_ORDER,
  ENDPOINT.STUDENT_DELETE_ACCOUNT,
  ENDPOINT.STUDENT_RATING,
  ENDPOINT.SEARCH_WORD,
  ENDPOINT.UPDATE_WORD,
  ENDPOINT.CREATE_WORD,
  ENDPOINT.ADMIN_UPDATE_LESSON_ORDER,
  ENDPOINT.PAYPAL_CREATE_SUBCRIPTION,
  ENDPOINT.PAYPAL_CAPTURE_SUBCRIPTION,
  ENDPOINT.PAYPAL_CANCEL_SUBCRIPTION
];

const removeTokenAndAvoidEndpoint: string[] = [
  ENDPOINT.SING_UP,
  ENDPOINT.STUDENT_COURSES_DEMO,
  ENDPOINT.STUDENT_COURSE_DEMO,
  ENDPOINT.SEND_EMAIL_RESET_PASSWORD
];

export {
  avoidTokenEndpoints,
  tokenFromHeaderEndpoints,
  tokenFromCookieEndpoints,
  removeTokenAndAvoidEndpoint
};
