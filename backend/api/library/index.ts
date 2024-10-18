import { Response } from 'express';
import { catchTry, connectToDatabase } from '../../tools/functions';
import { HTTP_STATUS_CODES, MESSAGE } from '../../tools/consts';
import { RequestType } from '../../tools/type';
import Library from '../../schemas/library.schema';

const endpoint = async (_: RequestType, res: Response) => {
  catchTry({
    res,
    message: 'There are no library available',
    endpoint: async (response) => {
      await connectToDatabase();

      const libraries = await Library.find().select({ __v: 0 });

      if (libraries.length > 0) {
        response.statusCode = HTTP_STATUS_CODES.OK;
        response.message = MESSAGE.SUCCESSFUL;
        response.data = libraries;
      }
    }
  });
};

export default endpoint;
