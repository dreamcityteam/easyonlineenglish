const { HTTP_STATUS_CODES, MESSAGE } = require('../../tools/const');
const { getResponse, send } = require('../../tools/functions');
const connectToDatabase = require('../../db');
const StudentCourse = require('../../schemas/studentCourse.schema');

module.exports = async (req, res) => {
  const response = getResponse(res);

  try {
    const { idStudentCourse, index } = req.body;

    await connectToDatabase();

    // Update the student course
    const studentCourse = await StudentCourse.findOneAndUpdate(
      { _id: idStudentCourse },
      { $set: { 'index.sentence': index } },
      { new: true }
    );

    // Check if the student course was successfully updated
    if (studentCourse) {
      response.message = MESSAGE.SUCCESSFUL;
      response.statusCode = HTTP_STATUS_CODES.OK;
      response.data = null;
    } else {
      response.message = 'Error updating student course.';
      response.statusCode = HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;
    }
  } catch (error) {
    console.error('Error occurred while updating student course:', error);
    response.message = 'Internal server error occurred.';
    response.statusCode = HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;
  }

  // Send the response
  send(response);
};
