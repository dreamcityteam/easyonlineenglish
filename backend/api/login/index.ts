import { Response } from 'express';
import User from '../../schemas/user.schema';
import {
  catchTry,
  connectToDatabase,
  getPayment,
  getToken,
  hash,
  setCookie
} from '../../tools/functions';
import { HTTP_STATUS_CODES, MESSAGE } from '../../tools/consts';
import { RequestType } from '../../tools/type';

const endpoint = async (req: RequestType, res: Response) => {
  catchTry({
    res,
    message: 'Correo electrónico o contraseña inválidos.',
    endpoint: async (response) => {
      await connectToDatabase();

      const { username = '', password = '' } = req.body;
      const field: string = username.trim().toLowerCase();
      const user = await User
        .findOne({ $or: [{ email: field }, { username: field }] })
        .select({ __v: 0 });

      response.data = { password: response.message };

      if (user && (await hash.compare({ password, hash: user.password || '' }))) {
        setCookie({ res, value: getToken({ _id: user._id }) });
        response.statusCode = HTTP_STATUS_CODES.OK;
        response.message = MESSAGE.SUCCESSFUL;
        response.data = user.toObject();
        response.data.payment = await getPayment(String(user?._id));
      }
    }
  });
};

export default endpoint;
