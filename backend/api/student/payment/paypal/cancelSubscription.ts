import { Response } from 'express';
import { catchTry, connectToDatabase } from '../../../../tools/functions';
import { RequestType } from '../../../../tools/type';
import { cancelSubscription } from './functions';
import { HTTP_STATUS_CODES } from '../../../../tools/consts';
import StudentPayment from '../../../../schemas/studentPayment.schema';

const endpoint = async (req: RequestType, res: Response) => {
  catchTry({
    res,
    message: 'No se pudo cancelar la suscripción.',
    endpoint: async (response) => {
      await connectToDatabase();

      const { subscriptionId, reason } = req.body;
      const { user: { _id } } = req;

      if (!subscriptionId || typeof subscriptionId !== 'string') {
        response.statusCode = HTTP_STATUS_CODES.BAD_REQUEST;
        response.message = 'ID de suscripción requerido y válido';
        return;
      }

      if (!_id) {
        response.statusCode = HTTP_STATUS_CODES.UNAUTHORIZED;
        response.message = 'Usuario no autenticado';
        return;
      }


      const payment = await StudentPayment.findOne({
        orderId: subscriptionId,
        idUser: _id
      });

      if (!payment) {
        response.statusCode = HTTP_STATUS_CODES.NOT_FOUND;
        response.message = 'Suscripción no encontrada o no pertenece al usuario';
        return;
      }

      if (payment.status === 'CANCELLED') {
        response.statusCode = HTTP_STATUS_CODES.OK;
        response.message = 'La suscripción ya está cancelada';
        response.data = {
          subscriptionId,
          status: 'CANCELLED',
          cancelledAt: payment.cancelledAt || new Date()
        };
        return;
      }

      const cancelReason = reason && reason.trim() ? reason.trim() : 'Cancelación solicitada por el usuario';
      const cancelled = await cancelSubscription(subscriptionId, cancelReason);

      if (cancelled) {
        const updateResult = await StudentPayment.updateOne(
          { orderId: subscriptionId, idUser: _id },
          {
            status: 'CANCELLED',
            cancelledAt: new Date(),
            cancelReason: cancelReason
          }
        );

        if (updateResult.modifiedCount === 0) {
          response.statusCode = HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;
          response.message = 'Suscripción cancelada en PayPal pero error al actualizar base de datos';
          return;
        }

        response.statusCode = HTTP_STATUS_CODES.OK;
        response.message = 'Suscripción cancelada exitosamente';
        response.data = {
          subscriptionId,
          status: 'CANCELLED',
          cancelledAt: new Date(),
          reason: cancelReason
        };
      } else {
        response.statusCode = HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;
        response.message = 'Error al cancelar la suscripción en PayPal. Intenta nuevamente.';
      }
    }
  });
};

export default endpoint;
