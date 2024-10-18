import { Response } from 'express';
import { catchTry, connectToDatabase } from '../../../tools/functions';
import { HTTP_STATUS_CODES, MESSAGE } from '../../../tools/consts';
import { RequestType } from '../../../tools/type';
import UserToken from '../../../schemas/userToken.schema';

const endpoint = async (req: RequestType, res: Response) => {
  catchTry({
    res,
    message: 'Invalid token.',
    endpoint: async (response) => {
      await connectToDatabase();
      const { user: { type, _id }, token } = req;

      const userToken = await UserToken.findOne({
        idUser: _id,
        type: 'PASSWORD',
        token,
      }).select({ __v: 0 });

      if (userToken && type === 'password') {
        response.message = MESSAGE.SUCCESSFUL;
        response.statusCode = HTTP_STATUS_CODES.OK;
      } else {
        response.statusCode = HTTP_STATUS_CODES.UNAUTHORIZED;
      }
    }
  });
};

export default endpoint;
