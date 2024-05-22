import React from 'react';
import style from './style.module.sass';

const page404: React.FC = (): JSX.Element => (
  <div className={style.page404}>
    <div className={style.page404__container}>
      <div className={style.page404__content}>
        <h3 className={style.page404__subTitle}>¡Ups! Página no encontrada</h3>
        <h1 className={style.page404__title}><span>4</span><span>0</span><span>4</span></h1>
      </div>
      <h2>Lo sentimos, pero la página que solicitaste no se ha encontrado.</h2>
    </div>
  </div>
);

export default page404;
