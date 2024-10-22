import { Response } from 'express';
import { catchTry, connectToDatabase } from '../../../../tools/functions';
import { HTTP_STATUS_CODES, INITIAL_COURSE, MESSAGE } from '../../../../tools/consts';
import { RequestType } from '../../../../tools/type';
import Course from '../../../../schemas/course.schema';
import CourseWord from '../../../../schemas/courseWord.schema';

const endpoint = async (_: RequestType, res: Response) => {
  catchTry({
    res,
    message: 'There is no course available',
    endpoint: async (response) => {
      await connectToDatabase();

      const course = await Course.findOne({ title: INITIAL_COURSE.TITLE }).select({ __v: 0 });
      const courseWord = await CourseWord
        .find({ idCourse: String(course?._id) })
        .select({ __v: 0, idCourse: 0 })
        .limit(10)
        .sort({ _id: 1 });

      if (course && courseWord) {
        const firstWord: string = String(courseWord[0]._id);
        const dataResponse = {
          ...course.toObject(),
          completedWords: {},
          index: { lesson: 0, word: 0 },
          isCompleted: false,
          progress: 0,
          unlockedWords: { [firstWord]: true },
          words: courseWord
        };

        response.statusCode = HTTP_STATUS_CODES.OK;
        response.message = MESSAGE.SUCCESSFUL;
        response.data = dataResponse;
      }
    }
  });
};

export default endpoint;
