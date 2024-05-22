const jwt = require('jsonwebtoken');
const { send, getResponse } = require('../../tools/functions');
const { HTTP_STATUS_CODES } = require('../../tools/constant');

const verifyToken = ({ req, res, next, authenticator }, token) => {
  const response = getResponse(res, 'Invalid token.');

  try {
    req.user = jwt.verify(token, process.env.ACCESS_KEY_TOKEN);
    req.token = token;
    return next();
  } catch (error) {
    authenticator.remove();
    response.statusCode = HTTP_STATUS_CODES.UNAUTHORIZED;
    return send(response);
  }
};

const getTokenFromHeader = (req) => {
  const authorizationHeader = req.header('Authorization');

  if (!authorizationHeader) return null;
  const [, token] = authorizationHeader.split(' ');
  return token;
};

module.exports = {
  getTokenFromHeader,
  verifyToken,
}