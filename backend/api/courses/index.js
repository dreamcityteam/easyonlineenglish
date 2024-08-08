const { HTTP_STATUS_CODES, MESSAGE } = require('../../tools/const');
const { getResponse, send } = require('../../tools/functions');
const connectToDatabase = require('../../db');
const Course = require('../../schemas/course.schema');
const StudentCourse = require('../../schemas/studentCourse.schema');

module.exports = async ({ user }, res) => {
  const response = getResponse(res);
  const userId = user.id;

  try {
    await connectToDatabase();

    let courses = await Course.find().lean().select({ __v: 0 });
    console.log(courses)
    if (courses.length === 0) {
      response.message = 'There are no courses available';
    } else {
      courses = await Promise.all(courses.map(async (course) => {
        const studentCourse = await StudentCourse.findOne({ idCourse: course._id, idUser: userId }).lean();
        return studentCourse ? { ...course, progress: studentCourse.progress } : course;
      }));

      response.data = courses;
      response.statusCode = HTTP_STATUS_CODES.OK;
      response.message = MESSAGE.SUCCESSFUL;
    }
  } catch (error) {
    console.error('Error fetching courses:', error);
    response.statusCode = HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;
    response.message = 'Failed to fetch courses';
  }

  send(response);
};
