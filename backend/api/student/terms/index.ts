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

      if (!student) return;

      // Update user
      const updatedUser = await User.findByIdAndUpdate(
        _id,
        {
          $set: { isTerms: true },
          $currentDate: { updatedAt: true }
        },
        { new: true }
      );

      response.statusCode = HTTP_STATUS_CODES.OK;
      response.message = MESSAGE.SUCCESSFUL;
      response.data = updatedUser;
    }
  });
};

export default endpoint;
