import { Response } from 'express';
import User from '../../schemas/user.schema';
import { catchTry, connectToDatabase, getPayment } from '../../tools/functions';
import { HTTP_STATUS_CODES, MESSAGE } from '../../tools/consts';
import { RequestType } from '../../tools/type';

const endpoint = async (req: RequestType, res: Response) => {
  catchTry({
    res,
    message: 'User not found',
    endpoint: async (response) => {
      await connectToDatabase();

      const { _id = '' } = req.user || {};
      const user = await User.findById(_id, { password: 0, __v: 0 });

      if (user && req.user.type === 'auth') {
        response.statusCode = HTTP_STATUS_CODES.OK;
        response.message = MESSAGE.SUCCESSFUL;
        response.data = user.toObject();
        response.data.payment = await getPayment(String(user?._id));
      }
    }
  });
};

export default endpoint;
