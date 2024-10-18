import React, { useEffect, useState } from 'react';
import Modal from '../../../../components/Modal';
import Close from '../../../../components/Modal/Close';
import Table from '../../../../components/Table';
import style from './style.module.sass';
import { PAYMENT_METHOD } from '../../../../tools/constant';
import { send } from '../../../../tools/function';

interface Props {
  state: [boolean, (value: boolean) => void];
}

const ModalInvoiceStory: React.FC<Props> = ({ state }) => {
  const [invoiceStory, setInvoiceStory] = useState([]);

  useEffect(() => {
    setStudentInvoiceStory();
  }, []);

  const setStudentInvoiceStory = async (): Promise<void> => {
    const { response: { data = [] } } = await send({
      api: 'student-invoice'
    }).get();

    setInvoiceStory(formatStudentInvoiceStory(data));
  }

  const formatStudentInvoiceStory = (data: any[]): any => {
    const result = data.map(({ plan, dateStart, dateEnd, amount, type }) => ({
      plan: PAYMENT_METHOD[plan].DESCRIPTION,
      dateStart: formatDate(dateStart),
      dateEnd: formatDate(dateEnd),
      amount,
      type: type === 'AZUL' ? 'Tarjetas de crédito' : 'Paypal',
    }));

    return result;
  }

  const formatDate = (value: string): string => {
    const date: Date = new Date(value);
    const months: string[] = [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];

    return `${date.getDate()} de ${months[date.getMonth()]} del ${date.getFullYear()}`;
  }

  return (
    <Modal
      state={state}
    >
      <div className={style.modal}>
        <div className={style.modal__content}>
          <Close onClose={() => state[1](false)} />
          <header className={style.modal__title}>
            <h2>Historial de pago</h2>
          </header>
          <Table
            style={style}
            data={invoiceStory}
            custom={{
              plan: { value: 'Descripción' },
              dateEnd: { value: 'Vencimiento' },
              dateStart: { value: 'Pago' },
              type: { value: 'Tipo de pago' },
              amount: { value: 'Monto' }
            }}
          />
        </div>
      </div>
    </Modal>
  );
}

export default ModalInvoiceStory;
