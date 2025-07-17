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

/**
 * Versión simplificada del componente PayPal Subscription
 * Basada en el componente de pagos únicos que funciona
 */
const PayPalSimple: React.FC<Props> = ({ plan, onComplete }): JSX.Element => {
  const [message, setMessage] = useState<string>('');
  const [colorMessage, _] = useState<'#4caf50' | '#f44336'>('#f44336');

  const isNotPaymentPlan = (): boolean =>
    !['1', '2', '3'].includes(plan);

  const createSubscription = async (): Promise<any> => {
    console.log('Creating subscription for plan:', plan);

    if (isNotPaymentPlan()) {
      setMessage('Método de pago inválido');
      console.error('Invalid payment plan:', plan);
      return;
    }

    try {
      console.log('Calling API: paypal-create-subscription with plan as query:', { plan });

      // El backend espera el plan como query parameter, no en el body
      const { response: { statusCode, data } = {} } = await send({
        api: `paypal-create-subscription?plan=${plan}`,
        data: {} // Body vacío porque el plan va en la query
      }).post();

      console.log('API Response:', { statusCode, data });

      if (statusCode === HTTP_STATUS_CODES.OK && data) {
        console.log('Subscription created successfully:', data);
        // El backend devuelve subscriptionId, no id
        return data.subscriptionId || data.id;
      } else {
        console.error('API Error - Status Code:', statusCode);
        setMessage('No se pudo iniciar la suscripción con PayPal.');
        return null;
      }
    } catch (error) {
      console.error('Exception during subscription creation:', error);
      setMessage('Error al crear la suscripción. Intenta nuevamente.');
      return null;
    }
  };

  const onApprove = async (data: any): Promise<any> => {
    console.log('Subscription approved:', data);
    
    const subscriptionId = data.subscriptionID;

    if (!subscriptionId) {
      console.error('No subscription ID received');
      setMessage('ID de suscripción no válido');
      return;
    }

    try {
      console.log('Calling API: paypal-capture-subscription with subscriptionId:', subscriptionId);

      const { response: { statusCode } = {} } = await send({
        api: 'paypal-capture-subscription',
        data: { subscriptionId }
      }).post();

      console.log('Capture API Response - Status Code:', statusCode);

      if (statusCode === HTTP_STATUS_CODES.OK) {
        console.log('Subscription captured successfully');
        setMessage('¡Suscripción activada exitosamente!');
        setTimeout(() => {
          onComplete();
        }, 1500);
      } else {
        console.error('Capture API Error - Status Code:', statusCode);
        setMessage('No se pudo confirmar la suscripción. Intenta nuevamente.');
      }
    } catch (error) {
      console.error('Exception during subscription capture:', error);
      setMessage('Error al confirmar la suscripción. Intenta nuevamente.');
    }
  };

  const onError = (err: any) => {
    console.error('PayPal Button Error:', err);
    setMessage('Error en el procesamiento de PayPal. Por favor, intenta nuevamente.');
  };

  const onCancel = () => {
    console.log('PayPal transaction cancelled');
    setMessage('Transacción cancelada por el usuario.');
  };

  return (
    <div className={style.paypal}>
      <div style={{ 
        padding: '10px', 
        marginBottom: '10px', 
        backgroundColor: '#e3f2fd', 
        border: '1px solid #2196f3',
        borderRadius: '4px'
      }}>
        <strong>Modo Simplificado</strong> - Plan: {plan}
      </div>

      <PayPalScriptProvider options={INITIAL_OPTION}>
        <PayPalButtons
          style={{
            shape: 'rect',
            layout: 'vertical',
            color: 'gold',
          }}
          createSubscription={createSubscription}
          onApprove={onApprove}
          onError={onError}
          onCancel={onCancel}
        />
      </PayPalScriptProvider>
      
      {message && (
        <p style={{ 
          color: colorMessage,
          marginTop: '10px',
          padding: '10px',
          backgroundColor: colorMessage === '#4caf50' ? '#e8f5e8' : '#ffeaea',
          border: `1px solid ${colorMessage}`,
          borderRadius: '4px'
        }}>
          {message}
        </p>
      )}
    </div>
  );
};

export default PayPalSimple;
