import React from 'react';
import style from './style.module.sass';

const ErrorConnection: React.FC = (): JSX.Element => (
  <section className={style.errorConnection}>
    <div>
      <header>
        <h2 className={style.errorConnection__title}>
          ¡Ohhh!
        </h2>
      </header>
      <div>
        <p className={style.errorConnection__text}>Parece que tienes una</p>
        <p className={style.errorConnection__text}>conexión Wifi/internet pobre</p>
      </div>
    </div>
  </section>
);

export default ErrorConnection;
