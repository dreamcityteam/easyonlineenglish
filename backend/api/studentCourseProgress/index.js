const { HTTP_STATUS_CODES } = require('../../tools/constant');
const { getResponse, send } = require('../../tools/functions');
const StudentCourse = require('../../schemas/studentCourse.schema');
const { getCourseProgress } = require('./function');
const CourseWord = require('../../schemas/courseWord.schema');

module.exports = async (req, res) => {
  const response = getResponse(res);

  try {
    const {
      idStudentCourse,
      index,
      unlockedWords,
      completedWords,
    } = req.body;

    // Find the student course by ID
    const studentCourseProgress = await StudentCourse.findById(idStudentCourse);
    const courseWordSize = await CourseWord.countDocuments({ idCourse: studentCourseProgress.idCourse });

    // Check if the student course exists
    if (!studentCourseProgress) {
      response.message = 'Invalid course.';
      response.statusCode = HTTP_STATUS_CODES.NOT_FOUND;
      return send(response);
    }

    // Calculate progress based on completedWords size
    const progress = getCourseProgress(studentCourseProgress.completedWords.size, courseWordSize);

    // Update the student course
    const studentCourse = await StudentCourse.findOneAndUpdate(
      { _id: idStudentCourse },
      {
        index,
        isCompleted: progress === 100,
        progress,
        $set: {
          [`unlockedWords.${unlockedWords}`]: true,
          [`completedWords.${completedWords}`]: true,
        }
      },
      { new: true } // Return the updated document
    );

    // Check if the student course was successfully updated
    if (studentCourse) {
      response.message = 'Student course updated successfully.';
      response.statusCode = HTTP_STATUS_CODES.OK;
      response.data = { progress };
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
