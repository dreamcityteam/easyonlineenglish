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
      const payment3dSecureService = new Payment3dSecureService();
      const { csv, expiration, number, plan, name } = req.body;

      response.data = {
        field: 'number',
        message: 'Error al intentar hacer la transacción, inténtalo más tarde.',
      };

      const dto = {
        paymentInformation: {
          cardholderName: 'CODIKA',
          cardNumber: number,
          expirationDate: '202505',
          cvv: '112',
          cardType: 'VISA',
          billingAddress: {
            country: 'Republica Dominicana',
            city: 'Santo Domingo',
            addressLine1: 'Calle 1',
            addressLine2: 'Los Aco',
            zone: 'Santo Domingo',
            zipCode: '10701',
          },
        },
        installments: 1,
        hasSpecialServiceList: true,
      };

      const price: number = 1000;
      const itbis: number = 180;

      await connectToDatabase();

      const transactionResp = await payment3dSecureService.MakePaymentOnSale(dto, price, itbis, false);

      response.data.message = MESSAGE.SUCCESSFUL;
      response.statusCode = HTTP_STATUS_CODES.OK;
      response.data.success = true;

      if (transactionResp.data.IsoCode === '99') {
        response.data.message = 'Número de tarjeta inválido.';
        response.data.success = false;
      } else if (transactionResp.data.IsoCode === '63') {
        response.data.message = 'Lo sentimos, su tarjeta ha sido declinada.';
        response.data.success = false;
      } else if (
        ['Expiration', 'ExpirationPassed'].includes(
          transactionResp.data.ErrorDescription.replace('VALIDATION_ERROR:', ''),
        )
      ) {
        response.data.message = 'Fecha de expiración inválida.';
        response.data.field = 'expiry';
        response.data.success = false;
      } else if (transactionResp.data.ErrorDescription === 'VALIDATION_ERROR:CVC') {
        response.data.message = 'El cvc es incorrecto.';
        response.data.field = 'cvc';
        response.data.success = false;
      }

      switch (transactionResp.respMsg) {
        case 'APROBADA':
          await payment3dSecureService.approvedTransaction(transactionResp.orderId, response);

          const transaction = await AzulTransactionResp.findOne({
            orderId: transactionResp.orderId
          })

          response.data.result = { transactionResp: transaction };
          response.data.message = 'OK';
          response.data.success = true;

          break;

        case '3D_SECURE_2_METHOD':
          response.data.result = { transactionResp };
          response.data.message = 'OK';
          response.data.success = true;
          break;
        case '3D_SECURE_CHALLENGE':
          response.data.result = { transactionResp };
          response.data.message = 'OK';
          response.data.success = true;
          break;
        default:
          response.data.success = false;
          response.data.message =
            'Hubo un error al iniciar la transacción. Pago declinado. Por favor, inténtelo de nuevo o utilice otro método de pago. Si persiste el problema, póngase en contacto con su comercio para obtener asistencia.';
          break;
      }
    },
    serverError: (response) => {
      response.data.message = 'Error al intentar hacer la transacción, inténtalo más tarde.';
    }
  });
};

export default endpoint;

