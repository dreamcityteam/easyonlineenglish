const { HTTP_STATUS_CODES, MESSAGE } = require('../../tools/const');
const { getResponse, send } = require('../../tools/functions');
const connectToDatabase = require('../../db');
const Course = require('../../schemas/course.schema');
const StudentCourse = require('../../schemas/studentCourse.schema');
const CourseWord = require('../../schemas/courseWord.schema');

module.exports = async (req, res) => {
  const response = getResponse(res);
  const userId = req.user.id;
  const idCourse = req.params.courseId;

  try {
    await connectToDatabase();

    // Find the student's course
    let studentCourse = await StudentCourse
      .findOne({ idCourse: idCourse, idUser: userId })
      .select({ __v: 0, idUser: 0, idCourse: 0 });
    const courseWord = await CourseWord
      .find({ idCourse: idCourse })
      .select({ __v: 0, idCourse: 0 })
      .sort({ _id: 1 });

    if (!studentCourse) {
      const firstWord = courseWord[0]._id;
      studentCourse = new StudentCourse({
        idCourse: idCourse,
        idUser: userId,
        unlockedWords: { [firstWord]: true },
      });
      await studentCourse.save();
    }

    const course = await Course.findOne({ _id: idCourse }).select({ __v: 0, _id: 0 });
    const studentCourseObj = studentCourse.toObject();
    const courseObj = course.toObject();

    if (course && studentCourse && courseWord) {
      const dataResponse = {
        idStudentCourse: studentCourseObj._id,
        ...courseObj,
        ...studentCourseObj,
        unlockedWords: Object.fromEntries(
          studentCourseObj.unlockedWords
        ),
        completedWords: Object.fromEntries(
          studentCourseObj.completedWords
        ),
        words: courseWord,
      };

      delete dataResponse._id;

      response.statusCode = HTTP_STATUS_CODES.OK;
      response.message = MESSAGE.SUCCESSFUL;
      response.data = dataResponse;
    } else {
      response.message = 'There are no courses available';
    }
  } catch (error) {
    const idCourseMessage = error.message.includes('idCourse');

    console.error('Error fetching courses:', error.message);
    response.statusCode = idCourseMessage
      ? HTTP_STATUS_CODES.NOT_FOUND
      : HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;

    response.message = idCourseMessage
      ? "We couldn't find the course"
      : error.message;
  }

  send(response);
};
