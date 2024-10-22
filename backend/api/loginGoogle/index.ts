import { Response } from 'express';
import { LoginTicket, OAuth2Client, TokenPayload } from 'google-auth-library';
import User from '../../schemas/user.schema';
import { connectToDatabase, getToken, setCookie, catchTry, getPayment } from '../../tools/functions';
import { HTTP_STATUS_CODES } from '../../tools/consts';
import { RequestType } from '../../tools/type';

const { GOOGLE_ID_CLIENT = '' } = process.env;
const client = new OAuth2Client(GOOGLE_ID_CLIENT);

const endpoint = async (req: RequestType, res: Response) => {
  catchTry({
    res,
    message: 'This account does not exist.',
    endpoint: async (response) => {
      await connectToDatabase();

      const { token = '' } = req.body;
      const ticket: LoginTicket = await client.verifyIdToken({
        idToken: token,
        audience: GOOGLE_ID_CLIENT,
      });
      const payload: TokenPayload | undefined = ticket.getPayload();
      const { sub: googleId = '' } = payload || {};
      const user = await User.findOne({ googleId }, { password: 0, __v: 0 });

      response.data = { password: response.message };

      if (user) {
        setCookie({ res, value: getToken({ _id: user._id }) });
      
        response.message = 'Successfully';
        response.statusCode = HTTP_STATUS_CODES.OK;
        response.data = {
          ...user.toObject(),
          payment: await getPayment(String(user?._id))
        };
      }
    }
  });
}

export default endpoint;
