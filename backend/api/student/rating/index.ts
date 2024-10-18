import { Response } from 'express';
import { catchTry, connectToDatabase, sendEmail } from '../../../tools/functions';
import { HTTP_STATUS_CODES, MESSAGE } from '../../../tools/consts';
import { RequestType } from '../../../tools/type';

const endpoint = async (req: RequestType, res: Response) => {
  catchTry({
    res,
    message: 'User not found!',
    endpoint: async (response) => {
      await connectToDatabase();

      const { email, name, lastname, rating, course, lesson } = req.body;
      const { EMAIL_USER = '' } = process.env;
      const emailConfig = {
        from: email,
        to: EMAIL_USER,
        subject: `easyonlineenglish - Rating`,
        html: `
          <p><strong>Lesson: </strong> ${lesson}</p>
          <p><strong>Course name: </strong> ${course}</p>
          <p><strong>Student name: </strong> ${name} ${lastname}</p>
          <p><strong>Student rating: </strong> ${rating}</p>
        `,
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
