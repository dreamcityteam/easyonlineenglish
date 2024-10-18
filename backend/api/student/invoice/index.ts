import { Response } from 'express';
import { catchTry, connectToDatabase } from '../../../tools/functions';
import { HTTP_STATUS_CODES, MESSAGE } from '../../../tools/consts';
import { RequestType } from '../../../tools/type';
import StudentPayment from '../../../schemas/studentPayment.schema';

const endpoint = async (req: RequestType, res: Response) => {
  catchTry({
    res,
    message: 'User not found!',
    endpoint: async (response) => {
      await connectToDatabase();

      const { _id } = req.user;
      const studentPayment = await StudentPayment
        .find({ idUser: _id })
        .select({
          __v: 0,
          _id: 0,
          azulCustomOrderId: 0,
          azulOrderId: 0,
          azulRRN: 0,
          azulTicket: 0,
          idUse: 0,
          idUser: 0,
          name: 0,
        })
        .sort({ _id: -1 });
  
      response.statusCode = HTTP_STATUS_CODES.OK;
      response.message = MESSAGE.SUCCESSFUL;
      response.data = studentPayment;
    }
  });
};

export default endpoint;
