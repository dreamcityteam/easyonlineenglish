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

  const { orderId } = req?.query;

  response.data = {
    field: 'number',
    message: 'Error al intentar hacer la transacción, inténtalo más tarde.'
  };

  try {

    await connectToDatabase();
   //Find transaction
   const transaction = await AzulTransactionResp.findOne({"orderId": orderId})


   const query = req?.query;
   const body = req?.body;

   if (!transaction) {
    //console.log("error", error);
    //response.message = error.message;
    response.statusCode = HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;
    response.data.message = 'Error al intentar hacer la transacción, inténtalo más tarde.';
   }

   if (body.cres) {
     const data = {
       AzulOrderId: transaction.AzulOrderId,
       CRes: body.cres
     };

     const treeResponse = await payment3dSecureService.ThreeDSecure2F(data);
     transaction.threeDSResponse = JSON.stringify(treeResponse)
     transaction.transactionResp.push(treeResponse)
     await transaction.save()

   } else if (body.PaRes && body.MD) {
     const data = {
       AzulOrderId: transaction.AzulOrderId,
       PaRes: body.PaRes,
       MD: body.MD
     };
     const treeResponseV1 = await payment3dSecureService.ThreeDSecure(data);
     transaction.transactionResp.push(treeResponseV1)
     transaction.statusMSG = treeResponseV1?.ErrorDescription != "" ? treeResponseV1.ErrorDescription : treeResponseV1?.ResponseMessage;
     await transaction.save()

   } else {

     transaction.threeDSResponse = JSON.stringify(body)
     transaction.transactionResp.push(body)
     await transaction.save()
   }

   if (body?.cres) {
    return res.redirect(`${process.env.FRONTEND_SERVER_URL}/paymentStatus?orderId=${query.orderId}`);
  } else {
    response.data.message = MESSAGE.SUCCESS;
    response.statusCode = HTTP_STATUS_CODES.OK;
    response.data.success = true;
    response.data.result = transaction;
  }
  
  } catch (error) {

    console.log("error", error);
    response.message = error.message;
    response.statusCode = HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;
    response.data.message = 'Error al intentar hacer la transacción, inténtalo más tarde.';
  }

  return send(response);
}
