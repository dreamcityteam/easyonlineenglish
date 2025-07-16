import { Response } from 'express';
import { catchTry } from '../../../../tools/functions';
import { RequestType } from '../../../../tools/type';
import { createBillingPlan, createProduct, createSubscription, isPlan } from './functions';
import { HTTP_STATUS_CODES } from '../../../../tools/consts';

const isNotSuccess = (response: any) => response.status !== 201;

const endpoint = async (req: RequestType, res: Response) => {
  catchTry({
    res,
    message: 'We couldn\'t make the plan.',
    endpoint: async (response) => {
      const plan: any = req.query.plan as any;

      if (!isPlan(plan)) {
        response.message = 'isn\'t a valid plan';
        return;
      }

      const responseCreateProduct = await createProduct(plan);
      if (isNotSuccess(responseCreateProduct)) {
        response.message = 'We couldn\'t create the product';
        return;
      }

      const responseBillingPlan = await createBillingPlan(plan, responseCreateProduct.data.id);
      if (isNotSuccess(responseBillingPlan)) {
        response.message = 'We couldn\'t create the billing plan';
        return;
      }

      const subscription = await createSubscription(responseBillingPlan.data.id);

      if (!subscription?.approveUrl) {
        response.message = 'Failed to get approval link';
        return;
      }

      response.statusCode = HTTP_STATUS_CODES.OK;
      response.data = {
        subscriptionId: subscription.id,
        status: subscription.status,
        approveUrl: subscription.approveUrl,
        plan: plan
      };
    }
  });
};

export default endpoint;
