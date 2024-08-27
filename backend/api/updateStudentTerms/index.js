const { getResponse, send } = require('../../tools/functions');
const { HTTP_STATUS_CODES, MESSAGE } = require('../../tools/const');
const connectToDatabase = require('../../db');
const User = require('../../schemas/user.schema');

module.exports = async (req, res) => {
  const response = getResponse(res);

  try {
    await connectToDatabase();

    /*const user = await User.findById(req.user.id);

    if (!user) {
      response.statusCode = HTTP_STATUS_CODES.NOT_FOUND;
      response.message = 'User not found.';
      return send(response);
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        $set: { isTerms: true },
        $currentDate: { updatedAt: true }
      },
      { new: true }
    );*/

    response.statusCode = HTTP_STATUS_CODES.OK;
    response.message = MESSAGE.SUCCESSFUL;
    response.data = {};
    //response.data = updatedUser;
  } catch (error) {
    response.statusCode = HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;
    response.message = `Error updating user: ${error.message}`;
  }

  send(response);
};
