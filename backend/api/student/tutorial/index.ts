import { Response } from 'express';
import { catchTry, connectToDatabase } from '../../../tools/functions';
import { HTTP_STATUS_CODES, MESSAGE } from '../../../tools/consts';
import { RequestType } from '../../../tools/type';
import User from '../../../schemas/user.schema';

const endpoint = async (req: RequestType, res: Response) => {
  catchTry({
    res,
    message: 'User not found!',
    endpoint: async (response) => {
      await connectToDatabase();

      const { _id } = req.user;
      const student = await User.findOneAndUpdate({ _id }, { isTutorial: false }, { new: true });

      if (student) {
        response.message = MESSAGE.SUCCESSFUL;
        response.statusCode = HTTP_STATUS_CODES.OK;
      } else {
        response.message = 'Error updating student.';
        response.statusCode = HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;
      }
    }
  });
};

export default endpoint;
