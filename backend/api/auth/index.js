const { getResponse, getToken, send, setCookie, hash } = require('../../tools/functions');
const connectToDatabase = require('../../db');
const { getIsPayment } = require('./functions');
const { HTTP_STATUS_CODES } = require('../../tools/constant');
const User = require('../../schemas/user.schema');

module.exports = async (req, res) => {
  const { username = '', password = '' } = req.body;
  const response = getResponse(res);

  try {
    await connectToDatabase();

    if (req.user) {
      const user = await User.findById(req.user.id, { password: 0, __v: 0 });

      if (!user) {
        response.message = 'User not found';
      } else {
        response.data = user.toObject();
        response.data.isPayment = await getIsPayment(req.user.id);
        response.statusCode = HTTP_STATUS_CODES.OK;
        response.message = 'Success!';
      }

      return send(response);
    }

    const field = username.toLowerCase();
    const user = await User.findOne({ $or: [{ email: field }, { username: field }] }).select({ __v: 0 });

    if (!user) {
      response.message = 'User not found';
      response.statusCode = HTTP_STATUS_CODES.NOT_FOUND;
    } else if (await hash.compare({ password, hash: user.password })) {
      setCookie({ res, value: getToken({ id: user._id }) });
      const { password, ...userData } = user.toObject();

      response.statusCode = HTTP_STATUS_CODES.OK;
      response.message = 'Success!';
      response.data = userData;
      response.data.isPayment = await getIsPayment(userData._id);
    }
  } catch (error) {
    response.message = `Error saving user! ${error}`;
    response.statusCode = HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;
  }

  send(response);
};
