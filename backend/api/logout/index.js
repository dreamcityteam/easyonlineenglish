const { HTTP_STATUS_CODES, MESSAGE } = require('../../tools/const');
const { getResponse, send, auth } = require('../../tools/functions');

module.exports = async (req, res) => {
  const response = getResponse(res);
  const authenticator = auth(res, req);

  authenticator.remove();
  response.statusCode = HTTP_STATUS_CODES.OK;
  response.message = MESSAGE.SUCCESSFUL;
  response.data = null;

  send(response);
};
