import React, { useRef } from 'react';
import Image from '../../../components/Image';
import style from './style.module.sass';
import { images } from './data';
import { Image as ImageType } from './type';
import { hookAnimation } from '../hook';

const Section2: React.FC = (): JSX.Element => {
  const imageRefs = [useRef(null), useRef(null), useRef(null)];

  hookAnimation({
    classNameAnimation: style.img__animation,
    ref: imageRefs,
  });

  return (
    <article className={style.home}>
      <div className={style.home__wrapper}>
        <header className={style.home__header}>
          <h2>El Proceso de Aprendizaje Más Fácil del Mundo</h2>
          <p>
            Te ofrecemos un enfoque fácil y simple que combina la teoría y la práctica,
            utilizando métodos modernos que fomentan la interacción en el idioma.
            Aprenderás un sinfín de palabras en inglés de
            <span className={style.home__block} />
            manera natural y sin frustración.
            Cero gramática.
          </p>
        </header>
        <div>
          <header className={style.home__header2}>
            <h2>Nuestra metodología se basa en:</h2>
            <h3>Garantizar una Comprensión Continua sin Confusión</h3>
          </header>
          <ul className={style.home__lists}>
            {images.map(({ text, ...props }: ImageType, index: number): JSX.Element =>
              <li key={index}>
                <Image {...props} ref={imageRefs[index]} />
                <span> {text} </span>
              </li>
            )}
          </ul>
        </div>
      </div>
    </article>
  );
}

export default Section2;
