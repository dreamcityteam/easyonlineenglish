import { Response } from 'express';
import User from '../../schemas/user.schema';
import { catchTry, connectToDatabase } from '../../tools/functions';
import { HTTP_STATUS_CODES } from '../../tools/consts';
import { RequestType } from '../../tools/type';
import CourseWord from '../../schemas/courseWord.schema';

const endpoint = async (req: RequestType, res: Response) => {
  catchTry({
    res,
    message: 'Word not found',
    endpoint: async (response) => {
      await connectToDatabase();

      const words = await CourseWord.find({ englishWord: req.body.searchTerm }).select({ __v: 0, idCourse: 0 });

      if (words.length > 0) {
        response.data = words;
        response.statusCode = HTTP_STATUS_CODES.OK;
      }
    }
  });
};

export default endpoint;
