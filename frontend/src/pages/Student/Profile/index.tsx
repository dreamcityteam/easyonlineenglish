import React, { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { State } from '../../../global/state/type';
import context from '../../../global/state/context';
import { formatPhoneNumber, isFree, isStudent, send, uploadBlob } from '../../../tools/function';
import { PLAN, inputs } from './data';
import { HTTP_STATUS_CODES, PAYMENT_METHOD, ROLE } from '../../../tools/constant';
import Form from '../../../components/Form';
import Modal from '../../../components/Modal';
import { DELETE_ACCOUNT, SET_USER, UPDATE_STUDENT_PHOTO } from '../../../global/state/actionTypes';
import Close from '../../../components/Modal/Close';
import style from './style.module.sass';
import Table from '../../../components/Table';
import './main.css';

const Profile: React.FC = (): JSX.Element => {
  const [{ user }] = useContext<[State, any]>(context);
  const [_, dispatch] = useContext<[State, any]>(context);
  const [isEditStudent, setIsEditStudent] = useState<boolean>(false);
  const [isStudentInvoiceStory, setIsStudentInvoiceStory] = useState<boolean>(false);
  const [invoiceStory, setInvoiceStory] = useState([]);
  const [isDeleteStudent, setIsDeleteStudent] = useState<boolean>(false);
  const fileInputRef = useRef(null);
  const redirect = useNavigate();

  useEffect(() => {
    setStudentInvoiceStory();
  }, []);

  const setStudentInvoiceStory = async (): Promise<void> => {
    const { response: { data = [] } } = await send({ api: 'student-invoice-story' }).get();

    setInvoiceStory(formatStudentInvoiceStory(data));
  }

  const onDeleteAcount = async (): Promise<void> => {
    const { response: { statusCode } } = await send({ api: 'student-delete-account' }).patch();

    if (statusCode === HTTP_STATUS_CODES.OK) {
      redirect('/login');
      dispatch({ type: DELETE_ACCOUNT });
    }
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

  const handleFileChange = (e: any): void => {
    handlerUploadPhoto(e.target.files[0]);
  }

  const handleButtonClick = (): void => {
    if (fileInputRef.current) {
      // @ts-ignore
      fileInputRef.current.click();
    }
  }

  const handlerUploadPhoto = async (file: any): Promise<void> => {
    const url: string = await uploadBlob({
      service: 'student-profile-image',
      file
    });

    if (url) {
      dispatch({ type: UPDATE_STUDENT_PHOTO, payload: { photo: url } });
    } else {
      alert('Error al intentar subir la imagen.');
    }
  }

  const getMembership = (): string => {
    let membership: string = 'N/A';

    if (user?.role === ROLE.FREE) {
      membership = 'Gratis';
    } else if (isStudent(user) && user?.payment.plan) {
      membership = PLAN[user.payment.plan];
    }

    return membership;
  }

  return (
    <section>
      <div className="profile-page">
        <div className="content">
          <div className="content__cover">
            <div
              className="content__avatar"
              style={{ background: `white url("${user?.photo}") center center no-repeat` }}
              onClick={handleButtonClick}
            ></div>
            <form className="content__file">
              <input type="file" onChange={handleFileChange} ref={fileInputRef}
              />
            </form>
          </div>
          <div className="content__title">
            <h2>
              {user?.name} {user?.lastname}
            </h2>
            <span>Estudiante - Easy Online English</span>
          </div>
          <div className="content__description">
          </div>
          <ul className="content__list">
            <li><span>Email</span>{user?.email}</li>
            <li><span>Telefono</span>{formatPhoneNumber(user?.phone)}</li>
            <li><span>Membresía</span>{getMembership()}</li>
          </ul>
          <div className="content__button">
            {!invoiceStory.length || isFree(user) && (
              <button
                className="button"
                onClick={() => setIsEditStudent(true)}
              >
                <p className="button__text">Historial de pago</p>
              </button>
            )}
            <button
              className="button"
              onClick={() => setIsStudentInvoiceStory(true)}
            >
              <p className="button__text">Editar estudiante</p>
            </button>
            <button
              className="button"
              onClick={() => setIsDeleteStudent(true)}
            >
              <p className="button__text">Borrar cuenta</p>
            </button>
          </div>
        </div>
        <div className="bg">
          <div><span></span><span></span><span></span><span></span><span></span><span></span><span></span>
          </div>
        </div>
      </div>
      <Modal
        canShow={isDeleteStudent}
      >
        <div className="modal">
          <div className="modal-delete-user">
            <Close onClose={() => setIsDeleteStudent(false)} />
            <header className="modal-table-title">
              <p>¿Estás seguro de que quieres borrar esta cuenta?</p>
            </header>
            <div className="modal-delete-user-button">
              <button onClick={onDeleteAcount}>Si</button>
              <button onClick={() => setIsDeleteStudent(false)}>No</button>
            </div>
          </div>
        </div>
      </Modal>
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
                dateEnd: { value: 'Vencimiento' },
                dateStart: { value: 'Pago' },
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
