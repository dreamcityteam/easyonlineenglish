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


module.exports = async (req, res) => {
  console.log("hello");
  const payment3dSecureService = new Payment3dSecureService();
  const response = getResponse(res);

  console.log("la");
  

  response.data = {
    field: 'number',
    message: 'Error al intentar hacer la transacción, inténtalo más tarde.'
  };

  try {

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

    response.data.result = transactionResp.data;
  } catch (error) {

    console.log("error", error);
    response.message = error.message;
    response.statusCode = HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;
    response.data.message = 'Error al intentar hacer la transacción, inténtalo más tarde.';
  }

  return send(response);
}
