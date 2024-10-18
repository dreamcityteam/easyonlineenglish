import { Response } from 'express';
import { LoginTicket, OAuth2Client, TokenPayload } from 'google-auth-library';
import User from '../../schemas/user.schema';
import { connectToDatabase, getToken, setCookie, catchTry, getLocation } from '../../tools/functions';
import { HTTP_STATUS_CODES } from '../../tools/consts';
import { RequestType } from '../../tools/type';

const { GOOGLE_ID_CLIENT = '' } = process.env;
const client = new OAuth2Client(GOOGLE_ID_CLIENT);

const endpoint = async (req: RequestType, res: Response) => {
  catchTry({
    res,
    message: 'This account is already registered.',
    endpoint: async (response) => {
      await connectToDatabase();

      const { token = '' } = req.body;
      const ticket: LoginTicket = await client.verifyIdToken({
        idToken: token,
        audience: GOOGLE_ID_CLIENT,
      });
      const payload: TokenPayload | undefined = ticket.getPayload();
      const { sub = '', email = '', given_name = '', family_name = '', picture = '' } = payload || {};
      let user;

      user = await User.findOne({ googleId: sub }, { password: 0, __v: 0 });

      if (user) {
        response.data = { password: response.message };
        return;
      }

      user = new User({
        email: email.toLowerCase(),
        googleId: sub,
        lastName: family_name.toLowerCase(),
        location: await getLocation(req),
        name: given_name.toLowerCase(),
        photo: picture,
        test: {
          questions: [],
          dateStart: Date.now(),
          isTest: true,
        }
      });

      await user.save();

      setCookie({ res, value: getToken({ _id: user._id }) });

      response.data = user;
      response.message = 'Successfully';
      response.statusCode = HTTP_STATUS_CODES.OK;
    }
  });
}

export default endpoint;
