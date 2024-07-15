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
                <h2>¡Aprende inglés <span className={style.home__block} /> y gana más!</h2>
              </header>
              <ul>
                <li>Aprendizaje fácil paso a paso</li>
                <li>Pronunciación correcta y acertada</li>
                <li>Frases y oraciones fáciles de recordar</li>
                <li>Mejora el aprendizaje a través de <span className={style.home__block} /> recursos audiovisuales</li>
              </ul>
              <div className={style.home__buttons}>
                <Link to="/courses">¡Prueba Gratis!</Link>
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
            <h2>El Proceso de Aprendizaje Más Fácil del Mundo</h2>
            <p>
              Te ofrecemos un enfoque fácil y simple que combina la teoría y la práctica, utilizando métodos modernos que fomentan la interacción en el idioma. Aprenderás un sinfín de palabras en inglés de <span className={style.home__block} /> manera natural y sin frustración.
              Cero gramática.
            </p>
          </header>
          <div>
            <header className={style.home__header2}>
              <h2>Nuestra metodología se basa en:</h2>
              <h3>Garantizar una Comprensión Continua sin Confusión</h3>
            </header>
            <ul className={style.home__lists}>
              <li>
                <img src={getPath('qE8ucK6enubb0INEh2patqPbQ0.avif')} ref={imageRefs[0]} />
                <span>Escucha la pronunciación adecuada tantas veces como sea necesario.</span>
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
        <div>
          <div className={style.home__content}>
            <div>
              <h2>¡Aprender inglés<span className={style.home__block} /> debería ser fácil!</h2>
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
            <div >
              <img ref={imageRefs[3]} src={getPath('sCf2ABHSWj7jfjsPTP6TIcLwI1M.avif')} />
            </div>
          </div>
        </div>
        <div className={style.home__discordContent}>
          <div>
            <h2>¡Únete a Nuestra Comunidad de Estudiantes!</h2>
          </div>
          <div className={style.home__discord}>
            <Link to="https://discord.com/invite/QFaTXbkd">Únete ahora</Link>
            <img src="https://framerusercontent.com/images/flTXIYdjwubkpivxjJdyzordw.png" alt="discord" />
          </div>
        </div>
      </article>

      <article className={style.home__article3}>
        <div className={style.home__wrapper}>
          <header className={style.home__header}>
            <h2>Testimonios</h2>
          </header>
          <div className={style.home__cards}>
            <div className={style.home__card}>
              <div>
                <img src={getPath('AqYDrXnc9nba3X6AihC98RgZKzk.avif')} alt="Foto de Eva Elle" />
                <div className={style.home__name}>
                  <h3>Erick García</h3>
                  <span>@erickg01</span>
                </div>
              </div>
              <p>
                Me encanta la forma en que EasyOnlineEnglish.com enseña inglés. Todo está muy bien estructurado y es perfecto para alguien que quiere aprender sin complicaciones.
                He mejorado muchísimo en poco tiempo.
              </p>
            </div>
            <div className={style.home__card}>
              <div>
                <img src={getPath('RsHZNf7AVvrb36YPDBI9Zmvs.avif')} alt="Foto de Guy Mccoy" />
                <div className={style.home__name}>
                  <h3>Juan Pérez</h3>
                  <span>@juanperez</span>
                </div>
              </div>
              <p>
                Había probado varios métodos para aprender inglés, pero nunca había encontrado uno tan efectivo como EasyOnlineEnglish.com.
                La flexibilidad de los planes y la claridad de las lecciones hacen que aprender sea un placer.
              </p>
            </div>
            <div className={style.home__card}>
              <div>
                <img src={getPath('QXASYLnZWZr7CbkkdgH7af8OEs.avif')} alt="Foto de Kayla Ray" />
                <div className={style.home__name}>
                  <h3>María Rodríguez</h3>
                  <span>@maríarodri</span>
                </div>
              </div>
              <p>
                Gracias a EasyOnlineEnglish.com, ahora puedo comunicarme en inglés con confianza.
                Los cursos son fáciles de seguir y realmente te ayudan a entender el idioma sin confusiones.
              </p>
            </div>
          </div>
        </div>
      </article>

      <article className={style.home__article4}>
        <div className={style.home__wrapper}>
          <div>
            <header>
              <h2>¡Mantente Informado!</h2>
              <p>
                Subscríbete a nuestro boletín de noticias y promociones.
                Descubre nuevos tips para aprender Inglés. ¡Es fácil y divertido!
              </p>
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
            <img src={getPath('qXInvyMi1fVRUXa2SCRVTH7A3Tk.avif')} alt="notificación" />
            <img src={getPath('nqof4mX8mtjt6e5VgAnOD4U.avif')} alt="notificación sombra" />
          </div>
        </div>
      </article>

      <article className={style.home__article5}>
        <div className={style.home__content}>
          <header>
            <h1>Aprender Inglés te Ayudará a Conseguir Mejores Oportunidades de Trabajo
            </h1>
            <p>
              Abre un mundo de nuevas posibilidades con Easy Online English
            </p>
          </header>
          <div>
            <div className={style.home__buttons}>
              <Link to="/courses">¡Empieza Ya!</Link>
            </div>
          </div>
        </div>
      </article>
    </section>
  );
}

export default Home;
