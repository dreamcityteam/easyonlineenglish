const fs = require('fs');
const https = require('https');
const axios = require('axios');
const path = require('path');
const { getResponse, send } = require('../../tools/functions');
const { HTTP_STATUS_CODES, PAYMENT_METHOD, MESSAGE } = require('../../tools/const');
const { getData, approvedTransaction } = require('./function');
const { payment } = require('../../tools/payment');
const cheerio = require('cheerio');
const FormData = require('form-data');
const Payment3dSecureService = require('./function');
const AzulTransactionResp = require('../../schemas/azulPaymentResp.schema');
const connectToDatabase = require('../../db');

module.exports = async (req, res) => {
  const response = getResponse(res);  
	const payment3dSecureService = new Payment3dSecureService();

  const { orderId } = req.query;


  response.data = {
    field: 'number',
    message: 'Error al consultar la transacción, inténtalo más tarde.'
  };

  try {

    await connectToDatabase();

    await payment3dSecureService.approvedTransaction(orderId, response);

    const transaction = await AzulTransactionResp.findOne({
      orderId: orderId
    })

    response.data.message = MESSAGE.SUCCESS;
    response.statusCode = HTTP_STATUS_CODES.OK;
    response.data.success = true;
    response.data.result = transaction;
   
  } catch (error) {

    console.log("error", error);
    response.message = error.message;
    response.statusCode = HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;
    response.data.message = 'Error al intentar hacer la transacción, inténtalo más tarde.';
  }

  return send(response);
}
