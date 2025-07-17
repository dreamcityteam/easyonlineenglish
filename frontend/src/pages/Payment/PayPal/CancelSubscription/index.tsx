import React, { useState, useEffect, useContext } from 'react';
import { send } from '../../../../tools/function';
import { HTTP_STATUS_CODES } from '../../../../tools/constant';
import context from '../../../../global/state/context';
import style from './style.module.sass';

interface Props {
  onCancelled: () => void;
  onError?: (message: string) => void;
}

const CancelSubscription: React.FC<Props> = ({ 
  onCancelled, 
  onError 
}): JSX.Element => {
  const [{ user }] = useContext(context);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [reason, setReason] = useState<string>('');

  const subscriptionId = user?.payment?.orderId || '';
  const paymentStatus = user?.payment?.status;

  // Debug: Log subscription ID when component mounts or updates
  useEffect(() => {
    console.log('CancelSubscription component - user payment:', user?.payment);
    console.log('subscriptionId from state:', subscriptionId);
    console.log('payment status:', paymentStatus);
  }, [user, subscriptionId, paymentStatus]);

  const handleCancel = async (): Promise<void> => {
    console.log('handleCancel called with subscriptionId:', subscriptionId);
    
    if (!subscriptionId || subscriptionId.trim() === '') {
      const errorMsg = 'ID de suscripción no válido o vacío';
      console.error(errorMsg, { subscriptionId, userPayment: user?.payment });
      onError?.(errorMsg);
      return;
    }

    const trimmedId = subscriptionId.trim();
    if (trimmedId.length < 5) {
      const errorMsg = 'ID de suscripción demasiado corto';
      console.error(errorMsg, { subscriptionId: trimmedId });
      onError?.(errorMsg);
      return;
    }

    setIsLoading(true);
    try {
      console.log('Attempting to cancel subscription:', {
        subscriptionId: trimmedId,
        reason: reason || 'Cancelación solicitada por el usuario'
      });
      
      const { response } = await send({
        api: 'paypal-cancel-subscription',
        data: { 
          subscriptionId: trimmedId,
          reason: reason || 'Cancelación solicitada por el usuario'
        }
      }).post();

      console.log('Cancel subscription response:', response);

      if (response?.statusCode === HTTP_STATUS_CODES.OK) {
        setShowConfirm(false);
        setReason('');
        onCancelled();
      } else {
        const errorMessage = response?.message || 'Error al cancelar la suscripción';
        console.error('Cancel subscription failed:', errorMessage);
        onError?.(errorMessage);
      }
    } catch (error) {
      console.error('Cancel subscription error:', error);
      onError?.('Error inesperado al cancelar la suscripción');
    } finally {
      setIsLoading(false);
    }
  };

  // No mostrar el botón si no hay subscriptionId válido o ya está cancelada
  if (!subscriptionId || subscriptionId.trim() === '' || paymentStatus === 'CANCELLED') {
    return (
      <div className={style.cancelSubscription}>
        <p style={{ color: '#f44336', textAlign: 'center' }}>
          {paymentStatus === 'CANCELLED' 
            ? 'La suscripción ya está cancelada' 
            : 'No se encontró suscripción activa para cancelar'
          }
        </p>
      </div>
    );
  }

  if (showConfirm) {
    return (
      <div className={style.cancelSubscription}>
        <div className={style.confirmDialog}>
          <h3>¿Estás seguro de que quieres cancelar tu suscripción?</h3>
          <p>Esta acción no se puede deshacer. Tu suscripción se cancelará inmediatamente.</p>
          
          <div className={style.reasonInput}>
            <label htmlFor="cancelReason">Motivo de cancelación (opcional):</label>
            <textarea
              id="cancelReason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Cuéntanos por qué cancelas tu suscripción..."
              maxLength={500}
              disabled={isLoading}
            />
          </div>

          <div className={style.buttons}>
            <button
              onClick={handleCancel}
              disabled={isLoading}
              className={style.confirmButton}
              type="button"
            >
              {isLoading ? 'Cancelando...' : 'Sí, cancelar suscripción'}
            </button>
            <button
              onClick={() => setShowConfirm(false)}
              disabled={isLoading}
              className={style.backButton}
              type="button"
            >
              No, mantener suscripción
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={style.cancelSubscription}>
      <button
        onClick={() => setShowConfirm(true)}
        className={style.cancelButton}
        disabled={isLoading}
        type="button"
      >
        Cancelar Suscripción
      </button>
    </div>
  );
};

export default CancelSubscription;
