import React, { useEffect, useState } from 'react';
import style from './style.module.sass';

interface Prop {
  children?: JSX.Element | null | JSX.Element[];
  isFadeIn?: boolean;
  backgroundColor?: string;
  state: [boolean, (state: boolean) => void];
  isBackgroundClose ?: boolean;
};

const Modal: React.FC<Prop> = ({
  children,
  backgroundColor,
  isFadeIn,
  state,
  isBackgroundClose = true
}): JSX.Element => {
  const [canShow, setCanShow] = state;

  const onClick = ({ target }: any) => {
    target.classList.contains(style.modal) && setCanShow(isBackgroundClose);
  }

  return (
    <>
      {canShow && (
        <div
          onClick={onClick}
          style={{ backgroundColor }}
          className={`${style.modal} ${isFadeIn ? style.modal__fadeIn : ''}`}
        >
          {children}
        </div>
      )}
    </>
  );
}

export default Modal;
