import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import Modal from '../../../../components/Modal';
import Close from '../../../../components/Modal/Close';
import style from './style.module.sass';
import Image from '../../../../components/Image';
import context from '../../../../global/state/context';
import { isStudent } from '../../../../tools/function';

interface Props {
  state: [boolean, any];
  isDemo: boolean;
};

const ModalWrongPronunciation: React.FC<Props> = ({ state, isDemo }): JSX.Element => {
  const [_, setCanShow] = state;
  const [{ user }] = useContext(context);
  const isDemoStudent: boolean = user?.payment?.isPayment === false && isStudent(user);
  const _isDemo: boolean = isDemo || isDemoStudent;

  return (
    <Modal
      state={state}
      isFadeIn
    >
      <div className={style.modal__container}>
        <Close onClose={() => setCanShow(false)} />
        <div className={style.modal__content}>
          {_isDemo ? (
            <>
              <header>
                <h2 className={style.modal__text}> ¡Finalizaste el curso! </h2>
              </header>
              <p>¡Enhorabuena por completar el curso demo! Si estás preparado para continuar tu aprendizaje, te invitamos a explorar nuestros planes y descubrir nuevas oportunidades de desarrollo profesional. ¡Avanza hacia tus metas!</p>
            </>
          ) : (
            <Image
              path="courses/Recurso_1-z3ArqllnhvTUlw1BgkjSUv99yNDQDY.webp"
              alt="Congratulations message"
              className={style.modal__image}
            />
          )}
          <Link
            to={_isDemo ? isDemoStudent ? '/plan' : '/register' : '/courses'}
            className={style.modal__button}
          >
            {_isDemo ? isDemoStudent ? 'Planes' : 'Registro' : 'Cursos'}
          </Link>
        </div>
      </div>
    </Modal>
  );
}

export default ModalWrongPronunciation;
