const { HTTP_STATUS_CODES, MESSAGE } = require('../../tools/const');
const { getResponse, send } = require('../../tools/functions');
const connectToDatabase = require('../../db');
const User = require('../../schemas/user.schema');

module.exports = async (req, res) => {
  const response = getResponse(res);

  try {
    await connectToDatabase();

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { deleted: true } },
      { new: true }
    );

    if (updatedUser) {
      response.data = null;
      response.statusCode = HTTP_STATUS_CODES.OK;
      response.message = MESSAGE.SUCCESSFUL;
    } else {
      response.statusCode = HTTP_STATUS_CODES.NOT_FOUND;
      response.message = 'User not found or already deleted';
    }
  } catch (error) {
    console.error('Error updating user:', error);
    response.statusCode = HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;
    response.message = 'Failed to update user';
  }

  send(response);
};
