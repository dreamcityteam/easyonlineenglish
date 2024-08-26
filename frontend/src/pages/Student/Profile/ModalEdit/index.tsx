import React, { useContext } from 'react';
import Modal from '../../../../components/Modal';
import Close from '../../../../components/Modal/Close';
import Form from '../../../../components/Form';
import { inputs } from '../data';
import context from '../../../../global/state/context';
import { State } from '../../../../global/state/type';
import { HTTP_STATUS_CODES } from '../../../../tools/constant';
import { SET_USER } from '../../../../global/state/actionTypes';
import style from './style.module.sass';

interface Props {
  state: [boolean, (value: boolean) => void];
}

const ModalEdit: React.FC<Props> = ({ state }) => {
  const [{ user }, dispatch] = useContext<[State, any]>(context);

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
      state[1](false);
    } else if (statusCode === HTTP_STATUS_CODES.UNAUTHORIZED) {
      field.validation.serverErrorMessage = 'La contraseña no es correcta.';
      updateState('oldPassword', field);
    } else if (statusCode === HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR) {
      field.validation.serverErrorMessage = 'Se produjo un error al intentar guardar los datos.';
      updateState('password', field);
    }
  }

  return (
    <Modal
      state={state}
    >
      <div className={style.modal}>
        <Close onClose={() => state[1](false)} />
        <Form
          api="student-update"
          buttonText="Guardar"
          inputs={inputs(user)}
          onData={onData}
        />
      </div>
    </Modal>
  );
}

export default ModalEdit;