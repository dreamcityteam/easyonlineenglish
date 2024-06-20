const { getResponse,  send, hash } = require('../../tools/functions');
const { REGEXP, HTTP_STATUS_CODES, MESSAGE } = require('../../tools/const');
const connectToDatabase = require('../../db');
const User = require('../../schemas/user.schema');

module.exports = async (req, res) => {
  const { name = '', lastname = '', phone = '', password = '', oldPassword = ''  } = req.body;
  const response = getResponse(res);
  const invalidFields = {};

  // Validate input fields
  if (!REGEXP.NAME.test(name)) {
    invalidFields['name'] = 'Please enter a valid name.';
  }

  if (!REGEXP.LAST_NAME.test(lastname)) {
    invalidFields['lastname'] = 'Please enter a valid last name.';
  }

  if (!REGEXP.PHONE_NUMBER.test(phone) && phone) {
    invalidFields['phone'] = 'Please enter a valid phone number.';
  }

  if (password && !REGEXP.PASSWORD.test(password)) {
    invalidFields['password'] = 'Password must be at least 8 characters long and contain a letter and a number.';
  }

  if (oldPassword && !REGEXP.PASSWORD.test(oldPassword)) {
    invalidFields['oldPassword'] = 'Old password must be at least 8 characters long and contain a letter and a number.';
  }

  if (Object.keys(invalidFields).length) {
    response.data = invalidFields;
    response.message = 'Invalid field: Please ensure all required fields are completed accurately.';
    return send(response);
  }

  try {
    await connectToDatabase();

    const user = await User.findById(req.user.id);

    if (!user) {
      response.statusCode = HTTP_STATUS_CODES.NOT_FOUND;
      response.message = 'User not found.';
      return send(response);
    }

    if (oldPassword || password) {

      // Compare oldPassword with hashed password stored in the database
      const passwordMatch = await hash.compare({ password: oldPassword, hash: user.password });

      if (!passwordMatch) {
        response.statusCode = HTTP_STATUS_CODES.UNAUTHORIZED;
        response.message = 'Incorrect old password.';
        response.data = { oldPassword: 'Incorrect old password.'};
        return send(response);
      }
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        $set: {
          name: name.toLowerCase(),
          lastname: lastname.toLowerCase(),
          phone,
          ...(password && oldPassword ? { password: await hash.create(password) } : {}),
        },
        $currentDate: {
          updatedAt: true
        }
      },
      { new: true }
    );

    response.statusCode = HTTP_STATUS_CODES.OK;
    response.message = MESSAGE.SUCCESSFUL;
    response.data = updatedUser;
  } catch (error) {
    response.statusCode = HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;
    response.message = `Error updating user: ${error.message}`;
  }

  send(response);
};
