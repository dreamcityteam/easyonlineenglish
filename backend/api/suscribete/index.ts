import { Response } from 'express';
import { catchTry, sendEmail } from '../../tools/functions';
import { HTTP_STATUS_CODES, MESSAGE } from '../../tools/consts';
import { RequestType } from '../../tools/type';

const endpoint = async (req: RequestType, res: Response) => {
  catchTry({
    res,
    message: 'Invalid course.',
    endpoint: async (response) => {
      const { email } = req.body;
      const { EMAIL_USER = '' } = process.env;
      const emailConfig = {
        from: email,
        to: EMAIL_USER,
        subject: `easyonlineenglish - suscripción`,
        html: `<p> Un nuevo usuario se ha suscrito a la página - ${email} </p>`,
      };
    
      if (await sendEmail(emailConfig)) {
        response.message = MESSAGE.SUCCESSFUL;
        response.statusCode = HTTP_STATUS_CODES.OK;
      } else {
        response.message = `Error sending email`;
        response.statusCode = HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;
      }    
    }
  });
};

export default endpoint;
