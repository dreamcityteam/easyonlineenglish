import e, { Response } from 'express';
import { catchTry, connectToDatabase, getPayment } from '../../../tools/functions';
import { HTTP_STATUS_CODES, MESSAGE, ROLE } from '../../../tools/consts';
import { RequestType } from '../../../tools/type';
import Course from '../../../schemas/course.schema';
import StudentCourse from '../../../schemas/studentCourse.schema';
import CourseWord from '../../../schemas/courseWord.schema';
import User from '../../../schemas/user.schema';

const endpoint = async (req: RequestType, res: Response) => {
  catchTry({
    res,
    message: 'There are no courses available',
    endpoint: async (response) => {
      await connectToDatabase();
      const userId: string = String(req.user._id);
      const idCourse: string = req.params.courseId;

      const payment = await getPayment(userId);
      const user = await User.findOne({ _id: userId }).select({ __v: 0 });
      const LIMIT: any = payment?.isPayment || user?.role === ROLE.ADMIN || user?.role === ROLE.FREE ? null : 10;

      // Find the student's course
      let studentCourse = await StudentCourse
        .findOne({ idCourse: idCourse, idUser: userId })
        .select({ __v: 0, idUser: 0, idCourse: 0 });

      const courseWord = await CourseWord
        .find({ idCourse: idCourse, type: 'word' })
        .select({ __v: 0, idCourse: 0 })
        .sort({ _id: 1 })
        .limit(LIMIT)
        .lean();

      const courseExercise = await CourseWord
        .find({ idCourse: idCourse, type: 'exercise' })
        .select({ __v: 0, idCourse: 0 })
        .sort({ _id: 1 })
        .limit(LIMIT)
        .lean();

      if (!studentCourse) {
        const firstWord: string = String(courseWord[0]._id);

        studentCourse = new StudentCourse({
          idCourse: idCourse,
          idUser: userId,
          unlockedWords: { [firstWord]: true },
        });

        await studentCourse.save();
      }

      const course = await Course.findOne({ _id: idCourse }).select({ __v: 0, _id: 0 });
      const studentCourseObj = studentCourse.toObject();

      if (course && studentCourse && courseWord) {
        const courseObj = course.toObject();

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
          exercises: courseExercise,
        };
 
        //@ts-ignore
        delete dataResponse._id;

        response.statusCode = HTTP_STATUS_CODES.OK;
        response.message = MESSAGE.SUCCESSFUL;
        response.data = dataResponse;
      }
    }
  });
};

export default endpoint;
