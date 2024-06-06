import React, { useContext, useState } from 'react';
import { State } from '../../../global/state/type';
import context from '../../../global/state/context';
import style from './style.module.sass';
import { formatPhoneNumber } from '../../../tools/function';
import { PLAN, inputs } from './data';
import { HTTP_STATUS_CODES } from '../../../tools/constant';
import Form from '../../../components/Form';
import Modal from '../../../components/Modal';
import { SET_USER } from '../../../global/state/actionTypes';
import './main.css';

const Profile: React.FC = (): JSX.Element => {
  const [{ user }] = useContext<[State, any]>(context);
  const [_, dispatch] = useContext<[State, any]>(context);
  const [isMondal, setIsMondal] = useState<boolean>(false);

  const onOpenMondal = (): void => {
    setIsMondal(true);
  }

  const onCloseonMondal = () => {
    setIsMondal(false);
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
      setIsMondal(false);
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
            <li><span>Membresía</span>{user?.payment.plan ? PLAN[user.payment.plan]: 'N/A'}</li>
          </ul>
          <div className="content__button">
            <span className="button" onClick={onOpenMondal}>
              <p className="button__text">Editar perfil</p>
            </span>
          </div>
        </div>
        <div className="bg">
          <div><span></span><span></span><span></span><span></span><span></span><span></span><span></span>
          </div>
        </div>
      </div>
      <Modal
        onClose={onCloseonMondal}
        canShow={isMondal}
      >
        <Form
          api="student-update"
          buttonText="Guardar"
          inputs={inputs(user)}
          onData={onData}
        />
      </Modal>
    </section >
  );
};

export default Profile;
