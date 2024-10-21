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

      const { orderId } = req?.query;
      const { cres, PaRes, MD } = req?.body;
      const payment3dSecureService: Payment3dSecureService = new Payment3dSecureService();

      // Find transaction
      const transaction = await AzulTransactionResp.findOne({ orderId })

      response.data = {
        field: 'number',
        message: 'Error al intentar hacer la transacción, inténtalo más tarde.'
      };

      if (!transaction) {
        response.statusCode = HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;
        response.data.message = 'Error al intentar hacer la transacción, inténtalo más tarde.';

        return;
      }

      if (cres) {
        const treeResponse = await payment3dSecureService.ThreeDSecure2F({
          AzulOrderId: String(transaction.AzulOrderId),
          CRes: cres
        });

        transaction.threeDSResponse = JSON.stringify(treeResponse)
        transaction.transactionResp.push(treeResponse)
        await transaction.save();
      } else if (PaRes && MD) {
        const treeResponseV1 = await payment3dSecureService.ThreeDSecure({
          AzulOrderId: String(transaction.AzulOrderId),
          PaRes: PaRes,
          MD: MD
        });

        transaction.transactionResp.push(treeResponseV1)
        transaction.statusMSG = treeResponseV1?.ErrorDescription != "" ? treeResponseV1.ErrorDescription : treeResponseV1?.ResponseMessage;
        await transaction.save();
      } else {
        transaction.threeDSResponse = JSON.stringify(req?.body)
        transaction.transactionResp.push(req?.body)
        await transaction.save();
      }

      if (cres) {
        return res.redirect(`${process.env.FRONTEND_SERVER_URL}/paymentStatus?orderId=${orderId}`);
      } else {
        response.data.message = MESSAGE.SUCCESSFUL;
        response.statusCode = HTTP_STATUS_CODES.OK;
        response.data.success = true;
        response.data.result = transaction;
      }
    },
    serverError: (response) => {
      response.data.message = 'Error al intentar hacer la transacción, inténtalo más tarde.';
    }
  });
};

export default endpoint;
