const { HTTP_STATUS_CODES, INITIAL_COURSE } = require('../../tools/constant');
const { getResponse, send } = require('../../tools/functions');
const connectToDatabase = require('../../db');
const Course = require('../../schemas/course.schema');
const CourseWord = require('../../schemas/courseWord.schema');

module.exports = async (_req, res) => {
  const response = getResponse(res);

  try {
    await connectToDatabase();

    const course = await Course.findOne({ title: INITIAL_COURSE.TITLE }).select({ __v: 0 });
    const courseWord = await CourseWord
      .find({ idCourse: course._id })
      .select({ __v: 0, idCourse: 0 })
      .limit(10)
      .sort({ _id: 1 });

    if (course && courseWord) {
      const firstWord = courseWord[0]._id;
      const dataResponse = {
        ...course.toObject(),
        index: { lesson: 0, word: 0 },
        isCompleted: false,
        progress: 0,
        unlockedWords: { [firstWord]: true },
        completedWords: {},
        words: courseWord
      };

      response.statusCode = HTTP_STATUS_CODES.OK;
      response.message = 'Courses fetched successfully';
      response.data = dataResponse;
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
