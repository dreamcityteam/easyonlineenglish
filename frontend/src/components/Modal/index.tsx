import React from 'react';
import style from './style.module.sass';

interface Prop {
  canShow: boolean;
  children?: JSX.Element | null | JSX.Element[];
  isFadeIn?: boolean;
  backgroundColor?: string;
};

const Modal: React.FC<Prop> = ({
  canShow,
  children,
  backgroundColor,
  isFadeIn 
}): JSX.Element => (
  <>
    {canShow && (
      <div
        style={{ backgroundColor }}
        className={`${style.modal} ${isFadeIn ? style.modal__fadeIn : '' }`}
      >
        {children}
      </div>
    )}
  </>
);

export default Modal;
