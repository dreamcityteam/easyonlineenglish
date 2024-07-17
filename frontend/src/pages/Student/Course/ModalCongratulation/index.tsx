import React from 'react';
import Modal from '../../../../components/Modal';
import Close from '../../../../components/Modal/Close';
import style from './style.module.sass';
import { Link } from 'react-router-dom';
import Confetti from '../../../../components/Confetti';

interface Props {
  state: [boolean, any];
  isDemo: boolean;
};

const ModalWrongPronunciation: React.FC<Props> = ({ state, isDemo }) => {
  const [canShow, setCanShow] = state;

  return (
    <Modal
    canShow={canShow}
    isFadeIn
  >
    <div className={style.modal__container}>
      <Close onClose={() => setCanShow(false)} />
      <header>
        <h2 className={style.modal__text}> ¡Finalizaste el curso! </h2>
      </header>
      <div className={style.modal__content}>
        {isDemo ? (
          <p>¡Enhorabuena por completar el curso demo! Si estás preparado para continuar tu aprendizaje, te invitamos a explorar nuestros planes y descubrir nuevas oportunidades de desarrollo profesional. ¡Avanza hacia tus metas!</p>
        ) : (
          <p className={style.modal__text}>¡Felicidades por completar el curso! <br /> Eso es un gran logro y demuestra tu compromiso con aprender y crecer.</p>
        )}
        <Link
          to={isDemo ? '/plan' : '/courses'}
          className={style.modal__button}
        >
          {isDemo ? 'planes' : 'Cursos'}
        </Link>
      </div>
      <Confetti />
    </div>
  </Modal>
  );
}

export default ModalWrongPronunciation;
