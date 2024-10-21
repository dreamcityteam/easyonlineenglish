import { Response } from 'express';
import { catchTry, connectToDatabase, hash } from '../../tools/functions';
import { HTTP_STATUS_CODES, MESSAGE, VALIDATOR } from '../../tools/consts';
import { ObjectValueString, RequestType } from '../../tools/type';
import User from '../../schemas/user.schema';
import UserToken from '../../schemas/userToken.schema';

const endpoint = async (req: RequestType, res: Response) => {
  catchTry({
    res,
    message: 'User not found.',
    endpoint: async (response) => {
      await connectToDatabase();

      const { password = '' } = req.body;
      const invalidFields: ObjectValueString = {};

      if (password && !VALIDATOR.PASSWORD.regExp.test(password)) {
        invalidFields['password'] = VALIDATOR.PASSWORD.message;
        response.data = invalidFields;
        return;
      }

      const user = await User.findById(req.user._id);

      if (!user) return;

      const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        {
          $set: {
            password: await hash.create(password),
            updatedAt: new Date(),
          }
        },
        { new: true }
      );

      await UserToken.deleteOne({ idUser: user._id });

      response.statusCode = HTTP_STATUS_CODES.OK;
      response.message = MESSAGE.SUCCESSFUL;
      response.data = updatedUser;
    }
  });
};

export default endpoint;
