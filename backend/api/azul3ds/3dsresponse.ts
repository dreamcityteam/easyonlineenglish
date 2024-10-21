import { Response } from 'express';
import { catchTry, connectToDatabase } from '../../tools/functions';
import { HTTP_STATUS_CODES, MESSAGE } from '../../tools/consts';
import { RequestType } from '../../tools/type';
import Payment3dSecureService from './function';
import AzulTransactionResp from '../../schemas/azulPaymentResp.schema';

const endpoint = async (req: RequestType, res: Response) => {
  catchTry({
    res,
    message: 'Error al intentar hacer la transacción, inténtalo más tarde.',
    endpoint: async (response) => {
      await connectToDatabase();

      const payment3dSecureService: Payment3dSecureService = new Payment3dSecureService();
      const { AzulOrderId } = req.body;

      response.data = {
        field: 'number',
        message: 'Error al intentar hacer la transacción, inténtalo más tarde.',
        success: false
      };

      const transaction = await AzulTransactionResp.findOne({
        AzulOrderId
      });

      if (!transaction) {
        response.data.message = 'Transacción inválida.';
        response.data.success = false;
        return;
      }

      const data = {
        AzulOrderId,
        MethodNotificationStatus: transaction?.threeDSResponse !== '' ? 'RECEIVED' : ''
      };

      const resp = await payment3dSecureService.ThreeDSecure2(data);

      transaction.transactionResp.push(resp);
      transaction.statusMSG = resp?.ErrorDescription != "" ? resp.ErrorDescription : resp?.ResponseMessage;

      await transaction.save()

      response.data.message = MESSAGE.SUCCESSFUL;
      response.statusCode = HTTP_STATUS_CODES.OK;
      response.data.success = true;
      response.data.result = resp;
    },
    serverError: (response) => {
      response.data.message = 'Error al intentar hacer la transacción, inténtalo más tarde.';
    }
  });
};

export default endpoint;
