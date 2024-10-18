const { HTTP_STATUS_CODES, INITIAL_COURSE, MESSAGE } = require('../../tools/const');
const { getResponse, send } = require('../../tools/functions');
const connectToDatabase = require('../../db');
const Course = require('../../schemas/course.schema');

module.exports = async (req, res) => {
  const response = getResponse(res);

  try {
    await connectToDatabase();

    const course = await Course.find().select({ __v: 0 });

    if (course) {
      response.statusCode = HTTP_STATUS_CODES.OK;
      response.message = MESSAGE.SUCCESSFUL;
      response.data = course;
    } else {
      response.message = 'There are no courses available';
    }
  } catch (error) {
    console.error('Error fetching courses:', error);
    response.statusCode = HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;
    response.message = 'Failed to fetch courses';
  }

  send(response);
};
