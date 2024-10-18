import React, { useContext } from 'react';
import Modal from '../../../../components/Modal';
import Close from '../../../../components/Modal/Close';
import Form from '../../../../components/Form';
import { inputs } from '../data';
import context from '../../../../global/state/context';
import { State } from '../../../../global/state/type';
import { SET_USER } from '../../../../global/state/actionTypes';
import style from './style.module.sass';

interface Props {
  state: [boolean, (value: boolean) => void];
};

const ModalEdit: React.FC<Props> = ({ state }) => {
  const [{ user }, dispatch] = useContext<[State, any]>(context);

  const onData = (data: any): void => {
    dispatch({ type: SET_USER, payload: data });
    state[1](false);
  }

  return (
    <Modal
      state={state}
    >
      <div className={style.modal}>
        <Close onClose={() => state[1](false)} />
        <Form
          title="Editar"
          api="student-update"
          buttonText="Guardar"
          fields={inputs(user)}
          onData={onData}
        />
      </div>
    </Modal>
  );
}

export default ModalEdit;