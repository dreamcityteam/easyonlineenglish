import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import Image from '../../../components/Image';
import style from './style.module.sass';
import useScrollAnimation from '../../../hooks/ScrollAnimation';

const Section3: React.FC = (): JSX.Element => {
  const imageRefs = useRef(null);

  useScrollAnimation({
    classNameAnimation: style.img__animation,
    ref: imageRefs,
    windowHeight: 400
  });

  return (
    <article className={style.home}>
      <div>
        <div className={style.home__content}>
          <div>
            <h2 className={style.home__title}>
              ¡Aprender inglés<span className={style.home__block} />
              debería ser fácil!
            </h2>
            <p>
              Aprender inglés puede ser un desafío cuando se basa únicamente
              en el estudio de la gramática y cuando se espera que los estudiantes comprendan
              vocabulario nuevo utilizando términos que todavía no dominan. Esta metodología tradicional
              indudablemente presenta serias dificultades para un aprendizaje efectivo.
              ¡Hemos encontrado una solución a través de un proceso que
              te guiará paso a paso a aprender el inglés de manera fácil!
            </p>
            <Link to="/courses">
              ¡Empieza ya!
            </Link>
          </div>
          <div className={style.home__image}>
            <Image
              alt="Young man"
              path="home/eoe_anna_w_laptop_small_360-Nm3ibANzYajysvGsqwKq08iTEYBfQl.png"
              ref={imageRefs}
            />
          </div>
        </div>
      </div>
      <div className={style.home__discord}>
        <div>
          <h2 className={style.home__title}>
            ¡Únete a Nuestra Comunidad de Estudiantes!
          </h2>
        </div>
        <div className={style.home__discordIcon}>
          <Link to="https://discord.com/invite/QFaTXbkd">Únete ahora</Link>
          <Image
            alt="Discord icon"
            path="home/Discord%20PNG%20Logo-01-fQjNmwmXk4EQkxrqVC9GqSSglWkxCQ.png"
          />
        </div>
      </div>
    </article>
  );
}

export default Section3;
