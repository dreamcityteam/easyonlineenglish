const { getResponse, getToken, send, setCookie, hash } = require('../../tools/functions');
const connectToDatabase = require('../../db');
const { getPayment } = require('./functions');
const { HTTP_STATUS_CODES, MESSAGE } = require('../../tools/const');
const User = require('../../schemas/user.schema');

module.exports = async (req, res) => {
  const { username = '', password = '' } = req.body;
  const response = getResponse(res);

  try {
    await connectToDatabase();

    if (req.user && req.user.type === 'auth') {
      const user = await User.findById(req.user.id, { password: 0, __v: 0 });

      if (!user) {
        response.message = 'User not found';
        response.statusCode = HTTP_STATUS_CODES.NOT_FOUND;
      } else if (user.deleted || !user.isActive) {
        response.statusCode = HTTP_STATUS_CODES.OK;
        response.message = user.deleted ? 'deleted' : 'actived';

        return send(response);
      } else {
        response.data = user.toObject();
        response.statusCode = HTTP_STATUS_CODES.OK;
        response.message = MESSAGE.SUCCESSFUL;
        response.data.payment = await getPayment(req.user.id);
      }

      return send(response);
    }

    const field = username.trim().toLowerCase();
    const user = await User.findOne({ $or: [{ email: field }, { username: field }] }).select({ __v: 0 });

    if (user && (await hash.compare({ password, hash: user.password }))) {
      if (user.deleted || !user.isActive) {
        response.statusCode = HTTP_STATUS_CODES.OK;
        response.message = user.deleted ? 'deleted' : 'actived';

        return send(response);
      }

      setCookie({ res, value: getToken({ id: user._id }) });
      const { password, ...userData } = user.toObject();

      response.statusCode = HTTP_STATUS_CODES.OK;
      response.message = MESSAGE.SUCCESSFUL;
      response.data = userData;
      response.data.payment = await getPayment(userData._id);
    } else {
      response.message = 'User not found';
      response.statusCode = HTTP_STATUS_CODES.NOT_FOUND;
    }
  } catch (error) {
    response.message = `Error ${error}`;
    response.statusCode = HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;
  }

  send(response);
};
