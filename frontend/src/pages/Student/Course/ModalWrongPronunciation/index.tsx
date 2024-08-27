import React from 'react';
import Modal from '../../../../components/Modal';
import Close from '../../../../components/Modal/Close';
import style from './style.module.sass';

interface Props {
  state: [boolean, any];
};

const ModalWrongPronunciation: React.FC<Props> = ({ state }) => {
  const [_, setCanShow] = state;

  return (
    <Modal
      state={state}
      isFadeIn
    >
      <div className={style.modal__message}>
        <Close onClose={() => setCanShow(false)} />
        <header>
          <h2 className={style.modal__title}>
            Estamos avanzando cada día más.
          </h2>
        </header>
        <div>
          <p>
            Ahora intentemos pronunciar más lento y con mayor precisión.
          </p>
        </div>
        <span
          onClick={() => setCanShow(false)}
          className={style.modal__button}
        >
          ¡Entiendo!
        </span>
      </div>
    </Modal>
  );
}

export default ModalWrongPronunciation;
