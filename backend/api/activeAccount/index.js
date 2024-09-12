const connectToDatabase = require('../../db');
const { HTTP_STATUS_CODES, MESSAGE } = require('../../tools/const');
const { send, getResponse, setCookie, getToken } = require('../../tools/functions');
const User = require('../../schemas/user.schema');
const UserToken = require('../../schemas/userToken.schema');

module.exports = async (req, res) => {
  const response = getResponse(res);
  const { type, id } = req.user;

  if (type !== 'active-account') {
    response.message = 'Invalid token';
    response.statusCode = HTTP_STATUS_CODES.UNAUTHORIZED;
    return send(response);
  }

  if (!id) {
    response.message = 'Invalid parameters';
    response.statusCode = HTTP_STATUS_CODES.BAD_REQUEST;
    return send(response);
  }

  try {
    await connectToDatabase();

    const userToken = await UserToken.findOne({
      idUser: id,
      type: 'ACTIVE_ACCOUNT',
      token: req.token,
    }).select({ __v: 0 });

    if (!userToken) {
      response.message = 'Invalid parameters';
      response.statusCode = HTTP_STATUS_CODES.BAD_REQUEST;
      return send(response);
    }

    const user = await User.findOneAndUpdate(
      { _id: id },
      { isActive: true },
      { new: true }
    )
      .select('-password -__v')
      .exec();

    if (!user) {
      response.message = 'User not found';
      response.statusCode = HTTP_STATUS_CODES.NOT_FOUND;
      return send(response);
    }

    await UserToken.deleteOne({ idUser: user._id });
    setCookie({ res, value: getToken({ id: user._id }) });
    response.message = MESSAGE.SUCCESSFUL;
    response.statusCode = HTTP_STATUS_CODES.OK;
    response.data = user;
  } catch (error) {
    console.error('Error updating user:', error); // Log detailed error
    response.message = 'Internal server error';
    response.statusCode = HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;
  }

  send(response);
};
