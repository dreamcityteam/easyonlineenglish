import { Response } from 'express';
import { catchTry } from '../../../../tools/functions';
import { RequestType } from '../../../../tools/type';
import { captureSubscription } from './functions';

const endpoint = async (req: RequestType, res: Response) => {
  catchTry({
    res,
    message: 'We couldn\'t verify the subscription.',
    endpoint: async (response) => {
      const { subscriptionId } = req.body;

      if (!subscriptionId) {
        response.message = 'Missing subscription ID';
        return;
      }

      const subscription = await captureSubscription(subscriptionId);

      if (subscription.status !== 'ACTIVE') {
        response.message = 'Subscription is not active';
        return;
      }
      console.log(subscription);
      response.data = subscription;
    }
  });
};

export default endpoint;
