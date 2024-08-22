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


module.exports = async (req, res) => {
  const response = getResponse(res);
  const certificateFile = fs.readFileSync(
    path.resolve(__dirname, 'certificate', 'pfx_easyonlineenglish.local.pfx')
  );
  const { csv, expiration, number, plan, name } = req.body;

  const PAYMENT = PAYMENT_METHOD[plan];
  // 'https://pagos.azul.com.do/WebServices/JSON/default.aspx'
  const API = 'https://pruebas.azul.com.do/WebServices/JSON/default.aspx';

  response.data = {
    field: 'number',
    message: 'Error al intentar hacer la transacción, inténtalo más tarde.'
  };

  try {
    
    const { data } = await axios.post(
      API,
      getData({
        number,
        expiration,
        csv,
        amount: PAYMENT.AMOUNT
      }),
      {
        httpsAgent: new https.Agent({
          hostname: 'pruebas.azul.com.do',
          port: 443,
          path: '/WebServices/JSON/default.aspx',
          method: 'POST',
          pfx: certificateFile,
          passphrase: '123',
        }),
        headers: {
          'Content-Type': 'application/json',
          'Auth1': '3dsecure',
          'Auth2': '3dsecure'
        }
      });
  
    if (data.IsoCode === '00') {
      const isPayment = await payment({
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

    } else if (data.IsoCode === '99') {
      response.data.message = 'Número de tarjeta inválido.';
    } else if (data.IsoCode === '63') {
      response.data.message = 'Lo sentimos, su tarjeta ha sido declinada.';
    } else if (['Expiration', 'ExpirationPassed'].includes(data.ErrorDescription.replace('VALIDATION_ERROR:', ''))) {
      response.data.message = 'Fecha de expiración inválida.';
      response.data.field = 'expiry';
    } else if (data.ErrorDescription === 'VALIDATION_ERROR:CVC') {
      response.data.message = 'El cvc es incorrecto.';
      response.data.field = 'cvc';
    } else {
      response.message = data.ErrorDescription;
    }
    
  } catch (error) {

    console.log("error", error);
    response.message = error.message;
    response.statusCode = HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;
    response.data.message = 'Error al intentar hacer la transacción, inténtalo más tarde.';
  }

  return send(response);
}
