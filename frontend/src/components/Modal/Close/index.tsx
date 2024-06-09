import React from 'react';
import style from './style.module.sass';
import SVGClose from '../../../../public/svg/close.svg';

interface Prop {
 onClose: (event: any) => void;
};

const Close: React.FC<Prop> = ({ onClose }) => (
  <div className={style.close} onClick={onClose}>
    <img src={SVGClose} alt="close modal" />
  </div>
);

export default Close;
