import { Response } from 'express';
import { catchTry } from '../../../../tools/functions';
import { HTTP_STATUS_CODES } from '../../../../tools/consts';
import { RequestType } from '../../../../tools/type';
import { createOrder, isPlan } from './functions';

const endpoint = async (req: RequestType, res: Response) => {
  catchTry({
    res,
    message: 'We couldn\'t make the order.',
    endpoint: async (response) => {

      if (!isPlan(req.body.plan)) {
        response.statusCode = HTTP_STATUS_CODES.BAD_REQUEST;
        response.message = 'Invalid plan.';
        response.data = null;
        return;
      }

      const paypalOrder = await createOrder(req.body.plan);

      if (paypalOrder.status === 'CREATED') {
        response.data = paypalOrder;
        response.statusCode = HTTP_STATUS_CODES.OK;
      }
    }
  });
};

export default endpoint;
