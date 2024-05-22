const { getResponse, send } = require('../../tools/functions');
const { HTTP_STATUS_CODES } = require('../../tools/constant');
const UserToken = require('../../schemas/userToken.schema');

module.exports = async (req, res) => {
  const response = getResponse(res);

  try {
    const userToken = await UserToken.findOne({
      idUser: req.user.id,
      type: 'PASSWORD',
      token: req.token,
    }).select({ __v: 0 });

    if (userToken) {
      response.message = 'successfully';
      response.statusCode = HTTP_STATUS_CODES.OK;
    } else {
      response.message = 'Invalid token.';
      response.statusCode = HTTP_STATUS_CODES.UNAUTHORIZED;
    }
  } catch (error) {
    response.message = `Error updating user: ${error.message}`;
    response.statusCode = HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;
  }

  send(response);
};
