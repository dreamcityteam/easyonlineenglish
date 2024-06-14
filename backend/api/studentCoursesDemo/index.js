const { HTTP_STATUS_CODES, INITIAL_COURSE } = require('../../tools/const');
const { getResponse, send } = require('../../tools/functions');
const connectToDatabase = require('../../db');
const Course = require('../../schemas/course.schema');

module.exports = async (req, res) => {
  const response = getResponse(res);

  try {
    await connectToDatabase();

    const course = await Course.findOne({ title: INITIAL_COURSE.TITLE }).select({ __v: 0 });

    if (course) {
      response.statusCode = HTTP_STATUS_CODES.OK;
      response.message = 'Courses fetched successfully';
      response.data = [course.toObject()];
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
