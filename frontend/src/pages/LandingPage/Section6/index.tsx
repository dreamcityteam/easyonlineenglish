import React from 'react';
import { Link } from 'react-router-dom';
import style from './style.module.sass';

const Section6: React.FC = (): JSX.Element => (
  <article className={style.home}>
    <div className={style.home__content}>
      <header>
        <h1>Aprender Inglés te Ayudará a Conseguir Mejores Oportunidades de Trabajo</h1>
        <p>Abre un mundo de nuevas posibilidades con Easy Online English</p>
      </header>
      <div>
        <div className={style.home__buttons}>
          <Link to="/courses">¡Empieza Ya!</Link>
        </div>
      </div>
    </div>
  </article>
);

export default Section6;
