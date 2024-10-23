import { Response } from 'express';
import { catchTry, connectToDatabase, getLink, getToken, sendEmail } from '../../../tools/functions';
import { HTTP_STATUS_CODES, MESSAGE } from '../../../tools/consts';
import { RequestType } from '../../../tools/type';
import User from '../../../schemas/user.schema';
import UserToken from '../../../schemas/userToken.schema';
import { getEmailTemplate } from './functions';

const endpoint = async (req: RequestType, res: Response) => {
  catchTry({
    res,
    message: 'The email doesn\'t exist.',
    endpoint: async (response) => {
      await connectToDatabase();

      const { email = '' } = req.body;
      const { EMAIL_USER = '' } = process.env;
      const user = await User
        .findOne({ email })
        .select({ __v: 0 });

      if (!user) {
        response.data = { email: 'El correo electrónico no existe.'};
        return;
      }

      const userToken = await UserToken
        .findOne({ idUser: user._id })
        .select({ __v: 0 });

      const token: string = getToken({ 
        _id: user._id,
        type: 'password',
        expiresIn: '2m'
      });

      if (!userToken) {
        const userToken = new UserToken({ idUser: user._id, token });
        await userToken.save();
      } else {
        await UserToken.findOneAndUpdate(
          { idUser: user._id },
          { $set: { token } },
        );
      }

      const emailConfig = {
        from: EMAIL_USER,
        to: email,
        subject: 'easyonlineenglish - Contraseña',
        html: getEmailTemplate({
          token: getLink({ req, path: 'reset-password-auth', token }),
          username: user.username || '',
          supportEmail: EMAIL_USER,
          telefono: '+1 (849) 410-9664'
        })
      };

      if (await sendEmail(emailConfig)) {
        response.message = MESSAGE.SUCCESSFUL;
        response.statusCode = HTTP_STATUS_CODES.OK;
      }
    }
  });
};

export default endpoint;
