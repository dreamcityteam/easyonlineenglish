import { Response } from 'express';
import { catchTry, connectToDatabase } from '../../tools/functions';
import { HTTP_STATUS_CODES } from '../../tools/consts';
import { RequestType } from '../../tools/type';
import CourseWord from '../../schemas/courseWord.schema';

const endpoint = async (req: RequestType, res: Response) => {
  await catchTry({
    res,
    message: 'Word not found',
    endpoint: async (response) => {
      await connectToDatabase();

      const { _id, ...data } = req.body;

      if (!_id) {
        response.statusCode = HTTP_STATUS_CODES.BAD_REQUEST;
        response.message = 'Missing _id in request body';
        return;
      }

      const updatedWord = await CourseWord.findOneAndUpdate(
        { _id },
        { $set: data },
        { new: true }
      );

      if (!updatedWord) {
        response.statusCode = HTTP_STATUS_CODES.NOT_FOUND;
        response.message = 'Word not found';
        return;
      }

      response.statusCode = HTTP_STATUS_CODES.OK;
      response.data = updatedWord;
    },
  });
};

export default endpoint;
