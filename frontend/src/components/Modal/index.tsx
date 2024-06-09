import React from 'react';
import style from './style.module.sass';
import SVGClose from '../../../public/svg/close.svg';

interface Prop {
  canShow: boolean;
  children?: JSX.Element | null | JSX.Element[];
  isFadeIn?: boolean;
  backgroundColor?: string;
  onClose?: () => void;
};

const Modal: React.FC<Prop> = ({ canShow, children, backgroundColor, isFadeIn, onClose }) => (
  <>
    {canShow && (
      <div
        style={{ backgroundColor }}
        className={`${style.modal} ${isFadeIn && style.modal__fadeIn}`}
      >
        {children}
      </div>
    )}
  </>
);

export default Modal;
