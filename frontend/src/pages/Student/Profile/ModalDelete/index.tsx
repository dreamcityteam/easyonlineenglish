import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '../../../../components/Modal';
import Close from '../../../../components/Modal/Close';
import { State } from '../../../../global/state/type';
import context from '../../../../global/state/context';
import { send } from '../../../../tools/function';
import { HTTP_STATUS_CODES } from '../../../../tools/constant';
import { DELETE_ACCOUNT } from '../../../../global/state/actionTypes';

interface Props {
  state: [boolean, (value: boolean) => void];
}

const ModalDelete: React.FC<Props> = ({ state }) => {
  const [_, dispatch] = useContext<[State, any]>(context);
  const redirect = useNavigate();

  const onDeleteAcount = async (): Promise<void> => {
    const { response: { statusCode } } = await send({
      api: 'student-delete-account'
    }).patch();

    if (statusCode === HTTP_STATUS_CODES.OK) {
      redirect('/login');
      dispatch({ type: DELETE_ACCOUNT });
    }
  }

  return (
    <Modal
      state={state}
    >
      <div className='modal'>
        <div className='modal-delete-user'>
          <Close onClose={() => state[1](false)} />
          <header className='modal-table-title'>
            <p>¿Estás seguro de que quieres borrar esta cuenta?</p>
          </header>
          <div className='modal-delete-user-button'>
            <button onClick={onDeleteAcount}>Si</button>
            <button onClick={() => state[1](false)}>No</button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default ModalDelete;