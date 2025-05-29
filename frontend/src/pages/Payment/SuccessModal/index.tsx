import React from 'react';
import { Link } from 'react-router-dom';
import Close from "../../../components/Modal/Close";
import Modal from "../../../components/Modal";
import style from './style.module.sass';
import SVGSuccess from '../../../../public/svg/success.svg';

interface Props {
  modalState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
};

const SuccessPayment: React.FC<Props> = ({ modalState }) => (
  <Modal state={modalState}>
    <div className={style.modal}>
      <Close onClose={() => modalState[1](false)} />
      <header className={style.modal__icon}>
        <img src={SVGSuccess} />
        <h2>éxito</h2>
      </header>
      <div className={style.modal__text}>
        <p>
          Tu pago ha sido procesado correctamente. Hemos enviado
          una factura a tu correo electrónico.
        </p>
      </div>
      <Link to="/courses" className={style.modal__button}>
        Comenzar los cursos
      </Link>
    </div>
  </Modal>
);

export default SuccessPayment;