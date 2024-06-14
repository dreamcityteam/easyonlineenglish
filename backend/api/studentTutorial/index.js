const { HTTP_STATUS_CODES } = require('../../tools/const');
const { getResponse, send } = require('../../tools/functions');
const connectToDatabase = require('../../db');
const User = require('../../schemas/user.schema');

module.exports = async (req, res) => {
  const response = getResponse(res);

  try {
    await connectToDatabase();

    const student = await User.findOneAndUpdate({ _id: req.user.id }, { isTutorial: false }, { new: true });

    // Check if the student course was successfully updated
    if (student) {
      response.message = 'Student updated successfully.';
      response.statusCode = HTTP_STATUS_CODES.OK;
    } else {
      response.message = 'Error updating student.';
      response.statusCode = HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;
    }
  } catch (error) {
    console.error('Error occurred while updating student course:', error);
    response.message = 'Internal server error occurred.';
    response.statusCode = HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;
  }

  send(response);
};
