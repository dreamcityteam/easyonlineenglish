const fs = require('fs');
const https = require('https');
const axios = require('axios');
const { getResponse, send, getMonth } = require('../../tools/functions');
const { HTTP_STATUS_CODES } = require('../../tools/constant');
const { getData } = require('./function');
const { PAYMENT_METHOD } = require('./const');
const path = require('path');
const StudentPayment = require('../../schemas/studentPayment.schema');

module.exports = async (req, res) => {
  const response = getResponse(res);
  const certificateFile = fs.readFileSync(
    path.resolve(__dirname, 'certificate', 'pfx_easyonlineenglish.local.pfx')
  );
  const { csv, expiration, number, plan, name } = req.body;
  const PAYMENT = PAYMENT_METHOD[plan];
  const API = 'https://pruebas.azul.com.do/WebServices/JSON/default.aspx';

  try {
    if (!PAYMENT) {
      response.message = 'Invalid payment method.';
      response.statusCode = HTTP_STATUS_CODES.NOT_FOUND;
      return send(response);
    }

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
        'Auth1': 'splitit',
        'Auth2': 'splitit'
      }
    });

    if (data.IsoCode === '00') {
      await (new StudentPayment({
        idUser: req.user.id,
        name,
        plan,
        dateEnd: getMonth(PAYMENT.DURATION_IN_MONTHS),
        RRN: data.RRN,
        CustomOrderId: data.CustomOrderId,
        AzulOrderId: data.AzulOrderId,
        Ticket: data.Ticket,
        amount: PAYMENT.AMOUNT
      }).save());
    }

    response.data = data;
    response.message = data.ErrorDescription;
    response.statusCode = HTTP_STATUS_CODES.OK;
  } catch (error) {
    response.message = error.message;
    response.statusCode = HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;
  }
  console.log(response.message)
  return send(response);
}
