const { getResponse,  send, hash } = require('../../tools/functions');
const { REGEXP, HTTP_STATUS_CODES } = require('../../tools/constant');
const User = require('../../schemas/user.schema');
const UserToken = require('../../schemas/userToken.schema');

module.exports = async (req, res) => {
  const { password = '' } = req.body;
  const response = getResponse(res);
  const invalidFields = {};

  if (password && !REGEXP.PASSWORD.test(password)) {
    invalidFields['password'] = 'Password must be at least 8 characters long and contain a letter and a number.';
  }

  if (invalidFields['password']) {
    response.data = invalidFields;
    response.message = 'Invalid field: Please ensure all required fields are completed accurately.';
    return send(response);
  }

  try {
    // Find user by ID
    const user = await User.findById(req.user.id);

    if (!user) {
      response.statusCode = HTTP_STATUS_CODES.NOT_FOUND;
      response.message = 'User not found.';
      return send(response);
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        $set: {
          password: await hash.create(password),
          updatedAt: new Date(),
        }
      },
      { new: true }
    );

    await UserToken.deleteOne({ idUser: user._id });

    response.statusCode = HTTP_STATUS_CODES.OK;
    response.message = 'User updated successfully.';
    response.data = updatedUser;
  } catch (error) {
    response.statusCode = HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;
    response.message = `Error updating user: ${error.message}`;
  }

  send(response);
};
