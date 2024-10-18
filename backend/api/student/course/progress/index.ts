import { Response } from 'express';
import { catchTry, connectToDatabase } from '../../../../tools/functions';
import { HTTP_STATUS_CODES, MESSAGE } from '../../../../tools/consts';
import { RequestType } from '../../../../tools/type';
import CourseWord from '../../../../schemas/courseWord.schema';
import StudentCourse from '../../../../schemas/studentCourse.schema';
import { getCourseProgress } from './functions';

const endpoint = async (req: RequestType, res: Response) => {
  catchTry({
    res,
    message: 'Invalid course.',
    endpoint: async (response) => {
      const {
        idStudentCourse,
        index,
        unlockedWords,
        completedWords,
      } = req.body;
  
      await connectToDatabase();
  
      // Find the student course by ID
      const studentCourseProgress = await StudentCourse.findById(idStudentCourse);
      const courseWordSize = await CourseWord.countDocuments({ idCourse: studentCourseProgress?.idCourse });
  
      // Check if the student course exists
      if (!studentCourseProgress) return;

      // Calculate progress based on completedWords size
      const progress: number = getCourseProgress(
        studentCourseProgress.completedWords.size,
        courseWordSize
      );
  
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
        response.message = MESSAGE.SUCCESSFUL;
        response.statusCode = HTTP_STATUS_CODES.OK;
        response.data = { progress };
      } else {
        response.message = 'Error updating student course.';
        response.statusCode = HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;
      }
    }
  });
};

export default endpoint;
