const fs = require('fs');
const https = require('https');
const axios = require('axios');
const path = require('path');
const { getResponse, send, sendEmail } = require('../../tools/functions');
const { HTTP_STATUS_CODES } = require('../../tools/constant');
const { getData, getHtmlMessage, getDurationInMonth, formatPhoneNumber, getMonthsDiff } = require('./function');
const { PAYMENT_METHOD } = require('./const');
const connectToDatabase = require('../../db');
const StudentPayment = require('../../schemas/studentPayment.schema');
const User = require('../../schemas/user.schema');

module.exports = async (req, res) => {
  const response = getResponse(res);
  const certificateFile = fs.readFileSync(
    path.resolve(__dirname, 'certificate', 'pfx_easyonlineenglish.local.pfx')
  );
  const { csv, expiration, number, plan, name } = req.body;
  const PAYMENT = PAYMENT_METHOD[plan];
  const API = 'https://pruebas.azul.com.do/WebServices/JSON/default.aspx';

  response.data = {
    field: 'number',
    message: 'Approvado'
  };

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
      await connectToDatabase();

      const user = await User.findOne({ _id: req.user.id }).select({ __v: 0 });

      if (user) {
        const payment = await StudentPayment.findOne({ idUser: req.user.id }).sort({ _id: -1 });
        const lastPayment = payment ? getMonthsDiff(payment.dateStart, payment.dateEnd) : 0;

        const newPayment = new StudentPayment({
          idUser: req.user.id,
          name,
          plan,
          dateEnd: getDurationInMonth(lastPayment + PAYMENT.DURATION_IN_MONTHS),
          RRN: data.RRN,
          CustomOrderId: data.CustomOrderId,
          AzulOrderId: data.AzulOrderId,
          Ticket: data.Ticket,
          amount: PAYMENT.AMOUNT
        });

        await newPayment.save();

        const emailConfig = {
          from: process.env.EMAIL_USER,
          to: user.email,
          subject: 'easyonlineenglish - FACTURA',
          html: getHtmlMessage({
            name: `${user.name} ${user.lastname}`,
            phone: formatPhoneNumber(user.phone),
            description: PAYMENT.DESCRIPTION,
            price: PAYMENT.AMOUNT,
            total: PAYMENT.AMOUNT,
            dateStart: newPayment.dateStart,
            dateEnd: newPayment.dateEnd,
          }),
        };

        if (await sendEmail(emailConfig)) {
          response.data.message = 'Aprovado.';
          response.statusCode = HTTP_STATUS_CODES.OK;
        }
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
    response.message = error.message;
    response.statusCode = HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;
    response.data.message = 'Error al intentar hacer la transacción, inténtalo más tarde.';
  }

  return send(response);
}
