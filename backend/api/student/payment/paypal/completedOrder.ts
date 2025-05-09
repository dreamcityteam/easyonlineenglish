import { Response } from 'express';
import { catchTry, connectToDatabase } from '../../../../tools/functions';
import { HTTP_STATUS_CODES } from '../../../../tools/consts';
import { RequestType } from '../../../../tools/type';
import { capturePayment, countMounts, isPlan } from './functions';
import StudentPayment from '../../../../schemas/studentPayment.schema';
import { PAYMENT_METHOD } from './data';

const endpoint = async (req: RequestType, res: Response) => {
  catchTry({
    res,
    message: 'We couldn\'t complete the order.',
    endpoint: async (response) => {
      await connectToDatabase();

      const { orderId = '', plan } = req.body;
      const { user: { _id } } = req;
  
      if (!isPlan(plan)) {
        response.statusCode = HTTP_STATUS_CODES.BAD_REQUEST;
        response.message = 'Invalid plan.';
        response.data = null;
        return;
      }

      const paypalCompletedOrder = await capturePayment(orderId);

      if (paypalCompletedOrder.status === 'COMPLETED') {
        const payerName = paypalCompletedOrder.payer.name;

        const studentPayment = new StudentPayment({
          orderId,
          idUser: _id,
          fullName: `${payerName.given_name} ${payerName.surname}`,
          plan,
          dateEnd: countMounts(PAYMENT_METHOD[plan].DURATION_IN_MONTHS),
          type: 'PAYPAL',
          amount: PAYMENT_METHOD[plan].AMOUNT
        });

        await studentPayment.save();

        response.data = paypalCompletedOrder;
        response.statusCode = HTTP_STATUS_CODES.OK;
      }
    }
  });
};

export default endpoint;
