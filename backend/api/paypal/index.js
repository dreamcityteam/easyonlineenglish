const { HTTP_STATUS_CODES, PAYMENT_METHOD } = require('../../tools/const');
const { getResponse, send } = require('../../tools/functions');
const { createOrder, captureOrder } = require('./function');
const { payment } = require('../../tools/payment');

module.exports = async (req, res) => {
  const response = getResponse(res);
  const { plan, orderID } = req.body;
  const PAYMENT = PAYMENT_METHOD[plan];
  let action;

  try {
    if (plan && !orderID) {
      action = await createOrder(plan);

    } else if (plan && orderID) {
      action = await captureOrder(orderID);

    } else {
      response.statusCode = HTTP_STATUS_CODES.BAD_REQUEST;
      response.message = 'Invalid parameters.';

      return send(response);
    }

    const { jsonResponse, httpStatusCode } = action;

    if (
      orderID &&
      plan &&
      jsonResponse.purchase_units[0].payments.captures[0].status === 'COMPLETED'
    ) {

      const isPayment = await payment({
        idUser: req.user.id,
        payment: {
          plan,
          amount: PAYMENT.AMOUNT,
          type: 'PAYPAL'
        }
      });
    
      if (isPayment) {
        response.statusCode = HTTP_STATUS_CODES.OK;
        response.data = jsonResponse;
        response.message = 'Success!';

        return send(response);
      }
    }

    response.data = jsonResponse;
    response.statusCode = httpStatusCode;
  } catch (error) {
    response.statusCode = HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;
    response.message = `Failed to create order. ${error}`;
  }

  send(response);
};
