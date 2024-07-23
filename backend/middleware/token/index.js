const { getResponse, send, auth } = require('../../tools/functions');
const { ENDPOINT } = require('../../tools/const');
const { getTokenFromHeader, verifyToken } = require('./functions');

module.exports = (req, res, next) => {
  const response = getResponse(res, 'Invalid token.');
  const authenticator = auth(res, req);
  const URL = req.originalUrl;
  const isEndpoint = (endpoint) => URL === `/api/v1/${endpoint}`;
  const verifyTokenOpcion = { req, res, next, authenticator };
  const tokenFromCookie = authenticator.get();
  const tokenFromHeader = getTokenFromHeader(req);

  if (isEndpoint(ENDPOINT.CONTANCT) || isEndpoint(ENDPOINT.SUSCRIBETE)) {
    return next();
  }

  if (tokenFromHeader && (
    isEndpoint(ENDPOINT.RESET_PASSWORD_AUTH) ||
    isEndpoint(ENDPOINT.RESET_PASSWORD)
  )) {
    return verifyToken(verifyTokenOpcion, tokenFromHeader);
  }

  if (
    tokenFromCookie && (
      isEndpoint(ENDPOINT.AUTH) ||
      isEndpoint(ENDPOINT.LOG_OUT) ||
      isEndpoint(ENDPOINT.COURSES) ||
      isEndpoint(ENDPOINT.STUDENT_COURSE_PROGRESS) ||
      isEndpoint(ENDPOINT.LIBRARY) ||
      isEndpoint(ENDPOINT.STUDENT_UPDATE) ||
      isEndpoint(ENDPOINT.AZUL_PAYMENT) ||
      isEndpoint(ENDPOINT.STUDENT_TUTORIAL) ||
      isEndpoint(ENDPOINT.PAYPAL) ||
      isEndpoint(ENDPOINT.STUDENT_INVOICE_STORY) ||
      isEndpoint(ENDPOINT.STUDENT_DELETE_ACCOUNT) ||
      isEndpoint(ENDPOINT.STUDENT_PROFILE_IMAGE) ||
      isEndpoint(ENDPOINT.UPDATE_STUDENT_TERMS) ||
      /^\/api\/v1\/student-course\/\w/.test(URL) ||
      /^\/api\/v1\/upload-file(?:\?filename=[^&]*)?$/.test(URL)
    )
  ) {
    return verifyToken(verifyTokenOpcion, tokenFromCookie);
  }

  if (
    isEndpoint(ENDPOINT.AUTH) ||
    isEndpoint(ENDPOINT.REGISTER) ||
    isEndpoint(ENDPOINT.STUDENT_COURSES_DEMO) ||
    isEndpoint(ENDPOINT.STUDENT_COURSE_DEMO) ||
    isEndpoint(ENDPOINT.SEND_EMAIL_RESET_PASSWORD)
  ) {
    authenticator.remove();
    return next();
  }

  if (req.originalUrl.includes('/api/v1')) {
    return send(response);
  }

  return next();
};
