import { Response } from 'express';
import { catchTry, connectToDatabase } from '../../tools/functions';
import { HTTP_STATUS_CODES, MESSAGE } from '../../tools/consts';
import { RequestType } from '../../tools/type';
import Payment3dSecureService from './function';
import AzulTransactionResp from '../../schemas/azulPaymentResp.schema';

const endpoint = async (req: RequestType, res: Response) => {
  catchTry({
    res,
    message: 'Error sending email',
    endpoint: async (response) => {
      await connectToDatabase();

    	const payment3dSecureService: Payment3dSecureService = new Payment3dSecureService();
      const { orderId = '' } = req.query;

      response.data = {
        field: 'number',
        message: 'Error al consultar la transacción, inténtalo más tarde.',
      };

      await payment3dSecureService.approvedTransaction(orderId, response);

      const transaction = await AzulTransactionResp.findOne({
        orderId: orderId
      });

      response.data.message = MESSAGE.SUCCESSFUL;
      response.statusCode = HTTP_STATUS_CODES.OK;
      response.data.success = true;
      response.data.result = transaction;
    },
    serverError: (response) => {
      response.data.message = 'Error al intentar hacer la transacción, inténtalo más tarde.';
    }
  });
};

export default endpoint;
