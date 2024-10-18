import { Response } from 'express';
import { catchTry, connectToDatabase } from '../../tools/functions';
import { HTTP_STATUS_CODES, MESSAGE } from '../../tools/consts';
import { RequestType } from '../../tools/type';
import Payment3dSecureService from './function';

const endpoint = async (_: RequestType, res: Response) => {
  catchTry({
    res,
    message: 'Error al intentar hacer la transacción, inténtalo más tarde.',
    endpoint: async (response) => {
      await connectToDatabase();

      const dto = {
        "paymentInformation": {
          "cardholderName": "CODIKA",
          "cardNumber": "4005520000000129",
          "expirationDate": "202505",
          "cvv": "112",
          "cardType": "VISA",
          "billingAddress": {
            "country": "Republica Dominicana",
            "city": "Santo Domingo",
            "addressLine1": "Calle 1",
            "addressLine2": "Los Aco",
            "zone": "Santo Domingo",
            "zipCode": "10701"
          }
        },
        "installments": 1,
        "hasSpecialServiceList": true
      }
  
      const price = 1000;
      const itbis = 180;
      
      const payment3dSecureService = new Payment3dSecureService();
      const transactionResp = await payment3dSecureService.MakePaymentOnSale(dto, price, itbis, false);
  
      console.log("transactionResp",transactionResp);
      
      if (transactionResp.data.IsoCode === '00' || '3D2METHOD') {
        /*const isPayment = await payment({
          idUser: req.user.id,
          payment: {
            name,
            plan,
            azulRRN: data.RRN,
            azulCustomOrderId: data.CustomOrderId,
            azulOrderId: data.AzulOrderId,
            azulTicket: data.Ticket,
            amount: PAYMENT.AMOUNT,
            type: 'AZUL'
          }
        });
  
        if (isPayment) {
          response.data.message = MESSAGE.SUCCESS;
          response.statusCode = HTTP_STATUS_CODES.OK;
        }*/
  
          response.data.message = MESSAGE.SUCCESSFUL;
          response.statusCode = HTTP_STATUS_CODES.OK;
          response.data.success = true;
  
  
      } else if (transactionResp.data.IsoCode === '99') {
        response.data.message = 'Número de tarjeta inválido.';
        response.data.success = false;
      } else if (transactionResp.data.IsoCode === '63') {
        response.data.message = 'Lo sentimos, su tarjeta ha sido declinada.';
        response.data.success = false;
      } else if (['Expiration', 'ExpirationPassed'].includes(transactionResp.data.ErrorDescription.replace('VALIDATION_ERROR:', ''))) {
        response.data.message = 'Fecha de expiración inválida.';
        response.data.field = 'expiry';
        response.data.success = false;
      } else if (transactionResp.data.ErrorDescription === 'VALIDATION_ERROR:CVC') {
        response.data.message = 'El cvc es incorrecto.';
        response.data.field = 'cvc';
        response.data.success = false;
  
      } else {
        response.message = transactionResp.data.ErrorDescription;
        response.data.success = false;
      }

      response.data.result = transactionResp.data;
    }
  });
};

export default endpoint;
