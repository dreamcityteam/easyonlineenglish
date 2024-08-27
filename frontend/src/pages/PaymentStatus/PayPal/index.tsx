import React, { useState } from 'react';
import { PayPalScriptProvider, PayPalButtons, } from '@paypal/react-paypal-js';
import { INITIAL_OPTION, STATUS_PAYPAL } from './data';
import { send } from '../../../tools/function';
import style from './style.module.sass';
import { HTTP_STATUS_CODES } from '../../../tools/constant';

interface Props {
  plan: string;
  onComplete: () => void;
}

const PayPal: React.FC<Props> = ({ plan, onComplete }): JSX.Element => {
  const [message, setMessage] = useState<string>('');
  const [colorMessage, setColorMessage] = useState<'#4caf50' | '#f44336'>('#f44336');

  const handlerCreateOrder = async (): Promise<any> => {
    const paymentMethodId: number = Number(plan);

    if (!(paymentMethodId > 0 && paymentMethodId <= 3)) {
      setMessage('Metodo de pago invalido');
    }

    const { response: { data: orderData = {} } } = await send({
      api: 'paypal',
      data: { plan }
    }).post();

    if (orderData.id) {
      return orderData.id;
    } else {
      const errorDetail: any = orderData?.details?.[0];
      const errorMessage: string = errorDetail
        ? `${errorDetail.issue} ${errorDetail.description} (${orderData.debug_id})`
        : JSON.stringify(orderData);

      console.error('errorMessage', errorMessage);
      setMessage('No se pudo iniciar PayPal.');
    }
  }

  const onApprove = async (data: any, actions: any): Promise<any> => {
    const { response: { data: orderData, statusCode } } = await send({
      api: 'paypal',
      data: { orderID: data.orderID, plan }
    }).post();

    if (
      statusCode === HTTP_STATUS_CODES.BAD_REQUEST ||
      statusCode === HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR
    ) {
      setMessage('Lo siento, no se pudo procesar tu transacción');
    }

    const errorDetail = orderData?.details?.[0];

    /*
      Three cases to handle:
        (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
        (2) Other non-recoverable errors -> Show a failure message
        (3) Successful transaction -> Show confirmation or thank you message
    */

    if (errorDetail?.issue === STATUS_PAYPAL.INSTRUMENT_DECLINED) {
      return actions.restart();
    } else if (errorDetail) {
      const errorMessage: string = `${errorDetail.description} (${orderData.debug_id})`;

      setMessage('Lo siento, no se pudo procesar tu transacción.');
      console.error(errorMessage);
    } else {
      const transaction = orderData.purchase_units[0].payments.captures[0];
      const status = transaction.status;

      if (status === STATUS_PAYPAL.COMPLETED) {
        onComplete();
      } else {
        setMessage(`Transacción ${transaction.status}.`);
        setColorMessage('#f44336');
      }
    }
  }

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