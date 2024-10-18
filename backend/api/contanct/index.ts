import { Response } from 'express';
import { catchTry, connectToDatabase, sendEmail } from '../../tools/functions';
import { HTTP_STATUS_CODES, MESSAGE } from '../../tools/consts';
import { RequestType } from '../../tools/type';

const endpoint = async (req: RequestType, res: Response) => {
  catchTry({
    res,
    message: 'Error sending email',
    endpoint: async (response) => {
      await connectToDatabase();

      const { name, email, subject, message } = req.body;
      const { EMAIL_USER = '' } = process.env;
      const emailConfig = {
        from: email,
        to: EMAIL_USER,
        subject: `easyonlineenglish - ${subject}`,
        html: `
          <p><strong>Nombre:</strong> ${name}</p>
          <p><strong>Mensaje:</strong> ${message}</p>
        `,
      };

      if (await sendEmail(emailConfig)) {
        response.message = MESSAGE.SUCCESSFUL;
        response.statusCode = HTTP_STATUS_CODES.OK;
      }
    }
  });
};

export default endpoint;
