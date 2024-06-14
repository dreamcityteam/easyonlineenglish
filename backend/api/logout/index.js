const { HTTP_STATUS_CODES } = require('../../tools/const');
const { getResponse, send, auth } = require('../../tools/functions');

module.exports = async (req, res) => {
  const response = getResponse(res);
  const authenticator = auth(res, req);

  authenticator.remove();
  response.statusCode = HTTP_STATUS_CODES.OK;
  response.message = 'Logout successfully!';
  response.data = null;

  send(response);
};
