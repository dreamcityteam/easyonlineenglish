import React, { useState } from 'react';
import { PayPalScriptProvider, PayPalButtons, } from '@paypal/react-paypal-js';
import { INITIAL_OPTION } from './data';
import { send } from '../../../tools/function';
import style from './style.module.sass';
import { HTTP_STATUS_CODES } from '../../../tools/constant';

interface Props {
  plan: string;
  onComplete: () => void;
}

const PayPal: React.FC<Props> = ({ plan, onComplete }): JSX.Element => {
  const [message, setMessage] = useState<string>('');
  const [colorMessage, _] = useState<'#4caf50' | '#f44336'>('#f44336');

  const handlerCreateOrder = async (): Promise<any> => {
    if (isNotPaymentPlan()) {
      setMessage('Metodo de pago invalido');
      return;
    }

    const { response: { statusCode, data } = {} } = await send({
      api: 'paypal-create-order',
      data: { plan }
    }).post();

    if (statusCode === HTTP_STATUS_CODES.OK) {
      return data.id;
    } else {
      setMessage('No se pudo iniciar PayPal.');
    }
  }

  const onApprove = async (data: any): Promise<any> => {
     if (isNotPaymentPlan()) {
      setMessage('Metodo de pago invalido');
      return;
    }

    const { response: { statusCode } = {} } = await send({
      api: 'paypal-completed-order',
      data: { orderId: data.orderID, plan }
    }).post();

    if (statusCode === HTTP_STATUS_CODES.OK) {
      onComplete();
    } else {
      setMessage('Lo sentimos, no hemos podido procesar tu transacción en este momento. Por favor, intenta nuevamente más tarde..');
    }
  }

  const isNotPaymentPlan = (): boolean =>
    !['1', '2', '3'].includes(plan);

  return (
    <div className={style.paypal}>
      <PayPalScriptProvider options={INITIAL_OPTION}>
        <PayPalButtons
          style={{
            shape: 'rect',
            layout: 'vertical',
            color: 'gold',
          }}
          createOrder={handlerCreateOrder}
          onApprove={onApprove}
        />
      </PayPalScriptProvider>
      {message && <p style={{ color: colorMessage }}> {message} </p>}
    </div>
  );
}

export default PayPal;