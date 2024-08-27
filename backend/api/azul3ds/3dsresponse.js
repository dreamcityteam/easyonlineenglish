const fs = require('fs');
const https = require('https');
const axios = require('axios');
const path = require('path');
const { getResponse, send } = require('../../tools/functions');
const { HTTP_STATUS_CODES, PAYMENT_METHOD, MESSAGE } = require('../../tools/const');
const { getData } = require('./function');
const { payment } = require('../../tools/payment');
const cheerio = require('cheerio');
const FormData = require('form-data');
const Payment3dSecureService = require('./function');
const AzulTransactionResp = require('../../schemas/azulPaymentResp.schema');
const connectToDatabase = require('../../db');

module.exports = async (req, res) => {
  const payment3dSecureService = new Payment3dSecureService();
  const response = getResponse(res);  

  const { AzulOrderId } = req.body;


  response.data = {
    field: 'number',
    message: 'Error al intentar hacer la transacción, inténtalo más tarde.'
  };

  try {
    await connectToDatabase();

    const transaction = await AzulTransactionResp.findOne({
        AzulOrderId
    })

    const data = {
      AzulOrderId,
      MethodNotificationStatus: transaction?.threeDSResponse !== '' ? 'RECEIVED' : ''
    };

    await connectToDatabase();

    const resp = await payment3dSecureService.ThreeDSecure2(data);

    transaction.transactionResp.push(resp)
    transaction.statusMSG = resp?.ErrorDescription != "" ? resp.ErrorDescription : resp?.ResponseMessage;

    await transaction.save()

    response.data.message = MESSAGE.SUCCESS;
    response.statusCode = HTTP_STATUS_CODES.OK;
    response.data.success = true;
    response.data.result = resp;
    /*
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
      }

        response.data.message = MESSAGE.SUCCESS;
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
      response.message = data.ErrorDescription;
      response.data.success = false;
    
    }

    response.data.result = transactionResp.data;*/
  } catch (error) {

    console.log("error", error);
    response.message = error.message;
    response.statusCode = HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;
    response.data.message = 'Error al intentar hacer la transacción, inténtalo más tarde.';
  }

  return send(response);
}
