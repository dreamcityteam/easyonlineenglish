import { Response } from 'express';
import { catchTry, connectToDatabase } from '../../../../tools/functions';
import { HTTP_STATUS_CODES, MESSAGE } from '../../../../tools/consts';
import { RequestType } from '../../../../tools/type';
import Course from '../../../../schemas/course.schema';

const endpoint = async (_: RequestType, res: Response) => {
  catchTry({
    res,
    message: 'There are no courses available',
    endpoint: async (response) => {
      await connectToDatabase();

      const course = await Course.find().select({ __v: 0 });

      if (course) {
        response.statusCode = HTTP_STATUS_CODES.OK;
        response.message = MESSAGE.SUCCESSFUL;
        response.data = course;
      }
    }
  });
};

export default endpoint;
