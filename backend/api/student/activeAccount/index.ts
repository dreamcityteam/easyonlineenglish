import { Response } from 'express';
import { catchTry, connectToDatabase, getToken, setCookie } from '../../../tools/functions';
import { HTTP_STATUS_CODES, MESSAGE } from '../../../tools/consts';
import { RequestType } from '../../../tools/type';
import User from '../../../schemas/user.schema';
import UserToken from '../../../schemas/userToken.schema';

const endpoint = async (req: RequestType, res: Response) => {
  catchTry({
    res,
    message: 'User not found!',
    endpoint: async (response) => {
      const { type, _id } = req.user;

      if (type !== 'active-account') {
        response.message = 'Invalid token';
        response.statusCode = HTTP_STATUS_CODES.UNAUTHORIZED;
        return;
      }

      if (!_id) {
        response.message = 'Invalid parameters';
        response.statusCode = HTTP_STATUS_CODES.BAD_REQUEST;
        return;
      }

      await connectToDatabase();

      const userToken = await UserToken.findOne({
        idUser: _id,
        type: 'ACTIVE_ACCOUNT',
        token: req.token,
      }).select({ __v: 0 });

      if (!userToken) {
        response.message = 'Invalid parameters';
        response.statusCode = HTTP_STATUS_CODES.BAD_REQUEST;
        return;
      }

      const user = await User.findOneAndUpdate(
        { _id },
        { isActive: true },
        { new: true }
      )
        .select('-password -__v')
        .exec();

      if (!user) {
        response.message = 'User not found';
        response.statusCode = HTTP_STATUS_CODES.NOT_FOUND;
        return;
      }

      await UserToken.deleteOne({ idUser: user._id });
      setCookie({ res, value: getToken({ _id: user._id }) });
      response.message = MESSAGE.SUCCESSFUL;
      response.statusCode = HTTP_STATUS_CODES.OK;
      response.data = user;
    }
  });
};

export default endpoint;
