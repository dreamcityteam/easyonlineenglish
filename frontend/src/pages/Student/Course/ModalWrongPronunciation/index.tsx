import React from 'react';
import Modal from '../../../../components/Modal';
import Close from '../../../../components/Modal/Close';
import style from './style.module.sass';

interface Props {
  state: [boolean, any];
};

const ModalWrongPronunciation: React.FC<Props> = ({ state }) => {
  const [canShow, setCanShow] = state;

  return (
    <Modal
      canShow={canShow}
      isFadeIn
    >
      <div className={style.modal__message}>
        <Close onClose={() => setCanShow(false)} />
        <header>
          <h2 className={style.modal__title}>
            No capto tus palabras
          </h2>
        </header>
        <div>
          <p>
            Por favor, intenta pronunciar más despacio.
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
