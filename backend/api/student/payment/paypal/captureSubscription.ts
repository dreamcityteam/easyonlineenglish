import { Response } from 'express';
import { catchTry, connectToDatabase } from '../../../../tools/functions';
import { RequestType } from '../../../../tools/type';
import { captureSubscription, countMounts } from './functions';
import { HTTP_STATUS_CODES } from '../../../../tools/consts';
import StudentPayment from '../../../../schemas/studentPayment.schema';
import { PAYMENT_METHOD } from './data';

const endpoint = async (req: RequestType, res: Response) => {
  catchTry({
    res,
    message: 'We couldn\'t verify the subscription.',
    endpoint: async (response) => {
      await connectToDatabase();
      
      const { subscriptionId } = req.body;
      const { user: { _id } } = req;

      if (!subscriptionId) {
        response.message = 'Missing subscription ID';
        return;
      }

      const subscription = await captureSubscription(subscriptionId);

      if (subscription.status !== 'ACTIVE') {
        response.message = 'Subscription is not active';
        return;
      }

      // Extraer el plan del subscription
      const plan = subscription.plan_id ? '1' : '1'; // Necesitarás mapear esto correctamente
      
      // Obtener información del suscriptor
      const subscriberName = subscription.subscriber?.name || {};
      const fullName = `${subscriberName.given_name || ''} ${subscriberName.surname || ''}`.trim() || 'PayPal Subscriber';

      // Crear registro de pago en la base de datos
      const studentPayment = new StudentPayment({
        orderId: subscriptionId,
        idUser: _id,
        fullName,
        plan,
        dateEnd: countMounts(PAYMENT_METHOD[plan].DURATION_IN_MONTHS),
        type: 'PAYPAL',
        amount: PAYMENT_METHOD[plan].AMOUNT
      });

      await studentPayment.save();

      response.statusCode = HTTP_STATUS_CODES.OK;
      response.data = subscription;
      response.data.studentPayment = studentPayment;
    }
  });
};

export default endpoint;
