import React, { useEffect, useRef, useState } from 'react';
import style from './style.module.sass';
import { Link } from 'react-router-dom';
import { getPath, send } from '../../tools/function';
import { HTTP_STATUS_CODES, REGEXP } from '../../tools/constant';

const Home: React.FC = () => {
  const imageRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
  const [email, setEmail] = useState('');
  const [subscribe, setSubscribe] = useState<any>({
    message: '',
    isSubscribe: false,
  });

  useEffect(() => {
    const handleScroll = () => {
      imageRefs.forEach((ref: React.MutableRefObject<any>, index: number) => {
        if (ref.current) {
          const fixWindowHeight = index === 3 ? 300 : 200;
          const element = ref.current;
          const rect = element.getBoundingClientRect();
          const windowHeight = window.innerHeight || document.documentElement.clientHeight;

          if (rect.top <= (windowHeight - fixWindowHeight) && rect.bottom >= 0) {
            element.classList.add(index === 3 ? style.img__animation : style.img__visible);
          }
        }
      });
    }

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const hanlderOnSuscribete = async () => {
    if (!email) {
      setSubscribe({
        message: 'Por favor, complete este campo.',
        isSubscribe: false
      });
    } else if (REGEXP.EMAIL.test(email)) {
      const { response: { statusCode } } = await send({ api: 'suscribete', data: { email } }).post();

      if (statusCode === HTTP_STATUS_CODES.OK) {
        setSubscribe({
          message: 'Enviado.',
          isSubscribe: true
        });
      } else {
        setSubscribe({
          message: 'Error, intente mas tarde.',
          isSubscribe: false
        });
      }
    } else {
      setSubscribe({
        message: 'El correo es inválido.',
        isSubscribe: false 
      });
    }
  }

  const onChange = ({ target: { value } }: any) => {
    setEmail(value);
  }

  return (
    <section className={style.home}>
      <article className={style.home__article1}>
        <div className={style.home__wrapper}>
          <div className={style.home__content}>
            <div>
              <header>
                <h2>¡Aprende inglés y gana más!</h2>
              </header>
              <ul>
                <li>El proceso de aprendizaje más sencillo del mundo</li>
                <li>Aprendizaje fácil paso a paso</li>
                <li>Pronunciación perfecta y correcta</li>
                <li>Frases y oraciones fáciles de recordar</li>
                <li>Mejora el aprendizaje a través de ayudas audiovisuales</li>
              </ul>
              <div className={style.home__buttons}>
                <Link to="/courses">¡Empezar ahora!</Link>
              </div>
            </div>
            <div className={style.home__circle}>
              <img
                className={style.home__image}
                src={getPath('pMFE0XKXXVETRMpSqtw9CtPiDE.avif')}
                alt="Imagen representando el aprendizaje del inglés"
              />
              <img
                className={style.home__image}
                src={getPath('b3kdXWf2vXaCYq8qBCAOsl4qwcA.avif')}
                alt="Imagen representando el aprendizaje del inglés"
              />
              <img
                className={style.home__image}
                src={getPath('I4gxLVRC32KmwsGsqa1yzYNcJpQ.webp')}
                alt="Imagen representando el aprendizaje del inglés"
              />
            </div>
          </div>
        </div>
      </article>

      <article className={style.home__article2}>
        <div className={style.home__wrapper}>
          <header className={style.home__header}>
            <h2>El curso de en inglés online más fácil del mundo</h2>
            <p>
              Nos enorgullece ofrecer un enfoque simple que combina la teoría con la práctica, utilizando métodos modernos y fomentando la interacción en el idioma.
              Los estudiantes adquieren un flujo natural del inglés sin la frustración de la gramática confusa.
            </p>
          </header>
          <div>
            <header className={style.home__header2}>
              <h2>Nuestra nueva metodología se basa en:</h2>
              <h3>Aprendizaje Continuo en Lugar de Confusión Continua</h3>
            </header>
            <ul className={style.home__lists}>
              <li>
                <img src={getPath('qE8ucK6enubb0INEh2patqPbQ0.avif')} ref={imageRefs[0]} />
                <span>Escucha la pronunciación adecuada de un hablante nativo tantas veces como sea necesario.</span>
              </li>
              <li>
                <img src={getPath('WYNKk7P5APEg2QjJehuVErtA.avif')} ref={imageRefs[1]} />
                <span>Refuerza la comprensión con nuestros recursos visuales.</span>
              </li>
              <li>
                <img src={getPath('rRnLeStRklfSvZQb73ndQBdNQ.avif')} ref={imageRefs[2]} />
                <span>Practica la pronunciación y gana confianza.</span>
              </li>
            </ul>
          </div>
        </div>
      </article>

      <article className={style.home__article20}>
        <div className={style.home__content}>
          <div>
            <span>Aprender inglés</span>
            <span>¡Es más fácil de lo que crees!</span>
            <p>
              Aprender inglés puede ser desafiante cuando se basa únicamente en el estudio de la gramática y también cuando se espera
              que los estudiantes comprendan nuevo vocabulario usando términos que aún no han dominado. Esta metodología tradicional
              indudablemente presenta serias dificultades para un aprendizaje efectivo. ¡Hemos encontrado una solución a través de un
              proceso fácil, paso a paso, que hace que sea fácil para ti aprender con Easy Online English!
            </p>
            <Link to="/courses">
              ¡Empieza ahora!
            </Link>
          </div>
          <div >
            <img ref={imageRefs[3]} src={getPath('sCf2ABHSWj7jfjsPTP6TIcLwI1M.avif')} />
          </div>
        </div>
      </article>

      <article className={style.home__article3}>
        <div className={style.home__wrapper}>
          <header className={style.home__header}>
            <h2>¡Mira lo que dicen!</h2>
          </header>
          <div className={style.home__cards}>
            <div className={style.home__card}>
              <div>
                <img src={getPath('AqYDrXnc9nba3X6AihC98RgZKzk.avif')} alt="Foto de Eva Elle" />
                <div className={style.home__name}>
                  <h3>Eva Elle</h3>
                  <span>@evaelle</span>
                </div>
              </div>
              <p>
                Jugando con @framer mientras construyo una página de aterrizaje para un proyecto paralelo.
                ¡Soy terrible en animaciones, pero lo hacen tan fácil!
              </p>
            </div>
            <div className={style.home__card}>
              <div>
                <img src={getPath('RsHZNf7AVvrb36YPDBI9Zmvs.avif')} alt="Foto de Guy Mccoy" />
                <div className={style.home__name}>
                  <h3>Guy Mccoy</h3>
                  <span>@mccoy</span>
                </div>
              </div>
              <p>
                ¡Gracias por construir una herramienta tan poderosa, especialmente para diseñadores!
                ¡El sitio pasó de Figma a Framer en menos de una semana!
              </p>
            </div>
            <div className={style.home__card}>
              <div>
                <img src={getPath('QXASYLnZWZr7CbkkdgH7af8OEs.avif')} alt="Foto de Kayla Ray" />
                <div className={style.home__name}>
                  <h3>Kayla Ray</h3>
                  <span>@kayray</span>
                </div>
              </div>
              <p>
                He construido sitios bastante útiles con Craft o WordPress en el pasado,
                pero ver a @framer abordar cosas de CMS tan fácilmente es alucinante.
              </p>
            </div>
          </div>
        </div>
      </article>

      <article className={style.home__article4}>
        <div className={style.home__wrapper}>
          <div>
            <header>
              <h2>¡Sé notado!</h2>
              <h3>¿Quieres noticias y promociones sobre nuestros cursos de inglés?</h3>
            </header>
            <form>
              <div>
                <input type="email" placeholder="Tu correo electrónico" onChange={onChange} />
                <span style={{ color: subscribe.isSubscribe ? '#4caf50' : '#f44336' }}>
                  {subscribe.message}
                </span>
              </div>
              <input type="button" value="Suscribirse" onClick={hanlderOnSuscribete} />
            </form>
          </div>
          <div>
            <img src={getPath('BqPht4yrBttiODwV1PygQKNE8Bk.avif')} alt="notificación" />
            <img src={getPath('nqof4mX8mtjt6e5VgAnOD4U.avif')} alt="notificación sombra" />
          </div>
        </div>
      </article>
      {/*
      <article>
        <header>
          <h2>Únete a nuestra gran comunidad de estudiantes</h2>
        </header>
        <div></div>
      </article>
      
      <article>
        <header>
          <h1>¡Empieza ahora! Y gana más</h1>
          <p>
            Aprender inglés te dará mejores oportunidades laborales con salarios más altos.
          </p>
        </header>
        <div>
          <span>Comenzar</span>
          <span>Aprender más</span>
        </div>
      </article>
      */}
    </section>
  );
}

export default Home;
