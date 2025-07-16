import React, { useState } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { INITIAL_OPTION } from './data';
import { send } from '../../../../tools/function';
import style from './style.module.sass';
import { HTTP_STATUS_CODES } from '../../../../tools/constant';

interface Props {
  plan: string;
  onComplete: () => void;
}

const PayPalSubscriptionWorking: React.FC<Props> = ({ plan, onComplete }): JSX.Element => {
  const [message, setMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const isValidPlan = (): boolean => ['1', '2', '3'].includes(plan);

  const createSubscription = async (): Promise<string> => {
    if (!isValidPlan()) {
      setMessage('Plan de pago inválido');
      throw new Error('Invalid plan');
    }

    setIsLoading(true);
    try {
      const { response: { statusCode, data } = {} } = await send({
        api: `paypal-create-subscription?plan=${plan}`,
        data: {}
      }).post();

      if (statusCode === HTTP_STATUS_CODES.OK && data?.subscriptionId) {
        return data.subscriptionId;
      } else {
        setMessage('No se pudo crear la suscripción');
        throw new Error('Failed to create subscription');
      }
    } catch (error) {
      setMessage('Error al crear la suscripción');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const onApprove = async (data: any): Promise<void> => {
    const subscriptionId = data.subscriptionID;

    if (!subscriptionId) {
      setMessage('ID de suscripción no válido');
      return;
    }

    setIsLoading(true);
    try {
      const { response: { statusCode } = {} } = await send({
        api: 'paypal-capture-subscription',
        data: { subscriptionId }
      }).post();

      if (statusCode === HTTP_STATUS_CODES.OK) {
        setMessage('¡Suscripción activada exitosamente!');
        setTimeout(() => onComplete(), 1500);
      } else {
        setMessage('No se pudo confirmar la suscripción');
      }
    } catch (error) {
      setMessage('Error al confirmar la suscripción');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={style.paypal}>
      <PayPalScriptProvider options={INITIAL_OPTION}>
        <PayPalButtons
          style={{
            shape: 'rect',
            layout: 'vertical',
            color: 'gold',
          }}
          disabled={isLoading}
          createSubscription={createSubscription}
          onApprove={onApprove}
          onError={(err) => {
            console.error('PayPal Error:', err);
            setMessage('Error en PayPal. Intenta nuevamente.');
          }}
          onCancel={() => {
            setMessage('Transacción cancelada.');
          }}
        />
      </PayPalScriptProvider>
      
      {isLoading && (
        <div style={{ textAlign: 'center', padding: '10px' }}>
          Procesando...
        </div>
      )}
      
      {message && (
        <div style={{
          color: message.includes('exitosamente') ? '#4caf50' : '#f44336',
          marginTop: '10px',
          padding: '10px',
          borderRadius: '4px',
          textAlign: 'center'
        }}>
          {message}
        </div>
      )}
    </div>
  );
};

export default PayPalSubscriptionWorking;