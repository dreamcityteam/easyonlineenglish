import React from 'react';
import { Link } from 'react-router-dom';
import Image from '../../../components/Image';
import { images } from './data';
import { Image as ImageType } from './type';
import style from './style.module.sass';

const Section1: React.FC = (): JSX.Element => (
  <article className={style.home}>
    <div className={style.home__wrapper}>
      <div className={style.home__content}>
        <div>
          <header>
            <h2>
              ¡Aprende inglés
              <span className={style.home__block} />
              y gana más!
            </h2>
          </header>
          <ul>
            <li>Aprendizaje fácil paso a paso</li>
            <li>Pronunciación correcta y acertada</li>
            <li>Frases y oraciones fáciles de recordar</li>
            <li>
              Mejora el aprendizaje a través de
              <span className={style.home__block} />
              recursos audiovisuales
            </li>
          </ul>
          <div className={style.home__buttons}>
            <Link to="/courses">¡Prueba Gratis!</Link>
          </div>
        </div>
        <div className={style.home__circle}>
          {images.map((props: ImageType, index: number): JSX.Element =>
            <Image
              {...props}
              className={style.home__image}
              key={index}
            />
          )}
        </div>
      </div>
    </div>
  </article>
);

export default Section1;
