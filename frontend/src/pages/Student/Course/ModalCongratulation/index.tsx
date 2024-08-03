import React from 'react';
import { Link } from 'react-router-dom';
import Modal from '../../../../components/Modal';
import Close from '../../../../components/Modal/Close';
import style from './style.module.sass';
import Image from '../../../../components/Image';

interface Props {
  state: [boolean, any];
  isDemo: boolean;
};

const ModalWrongPronunciation: React.FC<Props> = ({ state, isDemo }): JSX.Element => {
  const [canShow, setCanShow] = state;

  return (
    <Modal
    canShow={canShow}
    isFadeIn
  >
    <div className={style.modal__container}>
      <Close onClose={() => setCanShow(false)} />
      {isDemo && (
      <header>
        <h2 className={style.modal__text}> ¡Finalizaste el curso! </h2>
      </header>
      )}
      <div className={style.modal__content}>
        {isDemo ? (
          <p>¡Enhorabuena por completar el curso demo! Si estás preparado para continuar tu aprendizaje, te invitamos a explorar nuestros planes y descubrir nuevas oportunidades de desarrollo profesional. ¡Avanza hacia tus metas!</p>
        ) : (
          <Image
            path="courses/Recurso_1-z3ArqllnhvTUlw1BgkjSUv99yNDQDY.webp"
            alt="Congratulations message"
            className={style.modal__image}
          />
        )}
        <Link
          to={isDemo ? '/plan' : '/courses'}
          className={style.modal__button}
        >
          {isDemo ? 'Planes' : 'Cursos'}
        </Link>
      </div>
    </div>
  </Modal>
  );
}

export default ModalWrongPronunciation;
