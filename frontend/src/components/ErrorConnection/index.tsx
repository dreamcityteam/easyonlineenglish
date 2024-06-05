import React from 'react';
import style from './style.module.sass';

const ErrorConnection: React.FC = (): JSX.Element => (
  <section className={style.errorConnection}>
    <div>
      <header>
        <h1 className={style.errorConnection__title}>¡Ohhh!</h1>
      </header>
      <div>
        <p className={style.errorConnection__text}>Parece que tienes una</p>
        <p className={style.errorConnection__text}>conexión Wifi/internet pobre</p>
      </div>
    </div>
  </section>
);

export default ErrorConnection;
