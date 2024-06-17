import React, { useContext, useEffect, useState } from 'react';
import { State } from '../../../global/state/type';
import context from '../../../global/state/context';
import { formatPhoneNumber, send } from '../../../tools/function';
import { PLAN, inputs } from './data';
import { HTTP_STATUS_CODES, PAYMENT_METHOD } from '../../../tools/constant';
import Form from '../../../components/Form';
import Modal from '../../../components/Modal';
import { SET_USER } from '../../../global/state/actionTypes';
import './main.css';
import Close from '../../../components/Modal/Close';
import style from './style.module.sass';
import Table from '../../../components/Table';

const Profile: React.FC = (): JSX.Element => {
  const [{ user }] = useContext<[State, any]>(context);
  const [_, dispatch] = useContext<[State, any]>(context);
  const [isEditStudent, setIsEditStudent] = useState<boolean>(false);
  const [isStudentInvoiceStory, setIsStudentInvoiceStory] = useState<boolean>(false);
  const [invoiceStory, setInvoiceStory] = useState([]);

  useEffect(() => {
    setStudentInvoiceStory();
  }, []);

  const setStudentInvoiceStory = async () => {
    const { response: { data = [] } } = await send({ api: 'student-invoice-story' }).get();

    setInvoiceStory(formatStudentInvoiceStory(data));
  }

  const formatStudentInvoiceStory = (data: any[]): any => {
    const result = data.map(({ plan, dateStart, dateEnd, amount, type }) => ({
      plan: PAYMENT_METHOD[plan].DESCRIPTION,
      dateStart: formatDate(dateStart),
      dateEnd: formatDate(dateEnd),
      amount,
      type: type === 'AZUL' ? 'Tarjetas de crédito' : 'paypal',
    }));

    return result;
  }

  const formatDate = (value: string) => {
    const date: Date = new Date(value);
    const months: string[] = [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];

    return `${date.getDate()} de ${months[date.getMonth()]} del ${date.getFullYear()}`;
  }

  const onOpenMondal = (): void => {
    setIsEditStudent(true);
  }

  const onData = (payload: any, updateState: (key: string, field: any) => void): void => {
    const { statusCode, data } = payload.response;
    const field = {
      validation: {
        isNotValid: true,
        serverErrorMessage: ''
      }
    };

    if (statusCode === HTTP_STATUS_CODES.OK) {
      dispatch({ type: SET_USER, payload: data });
      setIsEditStudent(false);
    } else if (statusCode === HTTP_STATUS_CODES.UNAUTHORIZED) {
      field.validation.serverErrorMessage = 'La contraseña no es correcta.';
      updateState('oldPassword', field);
    } else if (statusCode === HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR) {
      field.validation.serverErrorMessage = 'Se produjo un error al intentar guardar los datos.';
      updateState('password', field);
    }
  }

  return (
    <section>
      <div className="profile-page">
        <div className="content">
          <div className="content__cover">
            <div className="content__avatar"></div>
            <div className="content__bull"><span></span><span></span><span></span><span></span><span></span>
            </div>
          </div>
          <div className="content__title">
            <h1>
              {user?.name} {user?.lastname}
            </h1>
            <span>Estudiante - Easy Online English</span>
          </div>
          <div className="content__description">
          </div>
          <ul className="content__list">
            <li><span>Email</span>{user?.email}</li>
            <li><span>Telefono</span>{formatPhoneNumber(user?.phone)}</li>
            <li><span>Membresía</span>{user?.payment.plan ? PLAN[user.payment.plan] : 'N/A'}</li>
          </ul>
          <div className="content__button">
            <span className="button" onClick={() => setIsEditStudent(true)}>
              <p className="button__text">Historial de pago</p>
            </span>
            <span className="button" onClick={() => setIsStudentInvoiceStory(true)}>
              <p className="button__text">Editar estudiante</p>
            </span>
          </div>
        </div>
        <div className="bg">
          <div><span></span><span></span><span></span><span></span><span></span><span></span><span></span>
          </div>
        </div>
      </div>
      <Modal
        canShow={isEditStudent}
      >
        <div className="modal">
          <div className="modal-table">
            <Close onClose={() => setIsEditStudent(false)} />
            <header className="modal-table-title">
              <h2>Historial de pago</h2>
            </header>
            <Table
              style={style}
              data={invoiceStory}
              custom={{
                plan: { value: 'Descripción' },
                dateEnd: { value: 'Fecha de vencimiento' },
                dateStart: { value: 'Fecha de pago' },
                type: { value: 'Tipo de pago' },
                amount: { value: 'Monto' }
              }}
            />
          </div>
        </div>
      </Modal>
      <Modal
        canShow={isStudentInvoiceStory}
      >
        <div className="modal">
          <Close onClose={() => setIsStudentInvoiceStory(false)} />
          <Form
            api="student-update"
            buttonText="Guardar"
            inputs={inputs(user)}
            onData={onData}
          />
        </div>
      </Modal>
    </section >
  );
};

export default Profile;
