import React, { useContext, useState } from 'react';
import { State } from '../../../global/state/type';
import context from '../../../global/state/context';
import style from './style.module.sass';
import { formatPhoneNumber } from '../../../tools/function';
import { inputs } from './data';
import { HTTP_STATUS_CODES } from '../../../tools/constant';
import Form from '../../../components/Form';
import Modal from '../../../components/Modal';
import { SET_USER } from '../../../global/state/actionTypes';

const Profile: React.FC = (): JSX.Element => {
  const [{ user }] = useContext<[State, any]>(context);
  const [_, dispatch] = useContext<[State, any]>(context);
  const [isMondal, setIsMondal] = useState<boolean>(false);

  const onOpenMondal= (): void => {
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
    <section className={style.profile}>
      <div className={style.profile__container}>
        <div className={style.profile__avatar}>
          <span>
            {user?.name && user?.lastname ? user.name[0] + user.lastname[0] : ''}
          </span>
        </div>
        <div className={style.profile__info_container}>
          <ul className={style.profile__info}>
            <li>{user?.name}</li>
            <li><strong>Apellido: </strong>{user?.lastname}</li>
            <li><strong>Email: </strong>{user?.email}</li>
            <li><strong>Teléfono: </strong>{formatPhoneNumber(user?.phone)}</li>
            <li><strong>Contraseña: </strong> **********</li>
          </ul>
          <span onClick={onOpenMondal} className={style.profile__button}> Editar</span>
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
    </section>
  );
};

export default Profile;
