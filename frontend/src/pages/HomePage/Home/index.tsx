import React, { useContext, useEffect, useState } from 'react';
import style from './style.module.sass';
import { Link } from 'react-router-dom';
import GoogleDriveImage from '../../../components/Image';
import context from '../../../global/state/context';

interface Prop {
  className?: string;
  img: {
    src: string;
    alt: string;
    className: string;
  };

  title: {
    className: string;
    value: string;
  };

  subTitle: {
    className: string;
    value: string;
  };
};

const Figure: React.FC<Prop> = ({ img, subTitle, title, className }) => (
  <figure {...className ? { className } : null}>
    <GoogleDriveImage
      id={img.src}
      alt={img.alt}
      className={img.className}
    />
    <figcaption>
      <span className={title.className}>{title.value}</span>
      <span className={subTitle.className}>{subTitle.value}</span>
    </figcaption>
  </figure>
);

const Home: React.FC = () => {
  const [{ user }] = useContext(context);
  const [buttonUrl, setButtonUrl] = useState<string>('');

  useEffect(() => {
    if (user === null || user.payment.isPayment) {
      setButtonUrl('/courses');
    } else {
      setButtonUrl('/plan');
    }
  }, [user]);

  return (
    <section>
      <article className={style.home}>
        <div className={style.home__container}>
          <header>
            <h1 className={style.home__title}>
              ¡Aprende Inglés
              <span className={style.block}>como segunda</span>
              lengua!
            </h1>
            <h2 className={style.home__subtitle}>3 Razones simples:</h2>
          </header>

          <ul className={style.home__items}>
            <li className={style.home__item}>Avance de la Carrera</li>
            <li className={style.home__item}>Simplicidad</li>
            <li className={style.home__item}>Conveniencia</li>
          </ul>
          <Link
            to={buttonUrl}
            className={style.home__button}
          >
            Empieza Ahora
          </Link>
        </div>
      </article>

      <article className={style.info}>
        <div className={style.info__container}>
          <div className={`${style.info__content} ${style.reverse}`}>
            <div>
              <header>
                <h3 className={style.info__title}>¿Hora de rendirse?</h3>
                <h2 className={style.info__subtitle}>
                  <span className={style.block}>¡Nosotros</span>
                  decimos No!
                </h2>
              </header>
              <p className={style.info__text}>
                El Inglés es difícil de aprender cuando te enfocas primero en la gramática y se espera
                de ti que entiendas las palabras que no entiendes usando palabras que tampoco entiendes.
                ¡No sorprende porque no funciona!
              </p>
            </div>

            <div>
              <GoogleDriveImage
                id="1H8tULyjHIz5_kexNU8XYfnaIiKouxyS4"
                alt="Niño con gafas leyendo"
                className={style.info__image}
              />
            </div>
          </div>
        </div>

        <div>
          <header>
            <h2 className={style.info__title}>
              Nuestro Método
            </h2>
          </header>

          <div className={style.info__container}>
            <div className={`${style.info__content} ${style.reverse}`}>
              <div>
                <ul className={style.info__items}>
                  <li className={style.info__item}>
                    Comience con lo que sabe hacer y vaya ampliando gradualmente,
                    con comprensión en cada paso, para aumentar su vocabulario.
                  </li>
                  <li className={style.info__item}>Aprenda la pronunciación adecuada.</li>
                  <li className={style.info__item}>Obtenga ejemplos de uso diario.</li>
                </ul>
              </div>
              <div>
                <GoogleDriveImage
                  id="106tXQ_Phft4dfPYO6gxy34HSmaCFL-da"
                  alt="Hombre con burbuja de discurso"
                  className={style.info__image}
                />
              </div>
            </div>
          </div>
        </div>

        <div className={style.info__container}>
          <div className={style.info__content}>
            <div>
              <GoogleDriveImage
                id="1LrtKzyg9H8uImn3agM0AwY2Qvajf5yRc"
                alt="Mujer aprendiendo inglés"
                className={style.info__image}
              />
            </div>
            <div>
              <ul className={style.info__items}>
                <li className={style.info__item}>Aprenda a usar oraciones comunes.</li>
                <li className={style.info__item}>Obtenga imágenes que muestran las palabras.</li>
                <li className={style.info__item}>Empiece a leer para aprender la gramática.</li>
              </ul>
            </div>
          </div>
        </div>

        <div className={style.info__container}>
          <div className={`${style.info__content} ${style.reverse}`}>
            <div>
              <ul className={style.info__items}>
                <li className={style.info__item}>Acceso 24/7.</li>
                <li className={style.info__item}>
                  Una biblioteca completa de temas adicionales como el alfabeto, días de la semana, los meses,
                  verbos conjugados y mucho más, todo traducido y pronunciado, en tus dedos.
                </li>
              </ul>
            </div>
            <div>
              <GoogleDriveImage
                id="1R9c6R9G5H_Yq3EHr_JngaXiW4hO9-IoY"
                alt="Servicio 24/7"
                className={style.info__image}
              />
            </div>
          </div>
        </div>
      </article>


      <article className={style.ceo}>
        <div className={style.ceo__container}>
          <div className={`${style.ceo__content} ${style.reverse}`}>
            <Figure
              className={style.ceo__figure}
              img={{
                src: '14qTHKJDSZRGvi00qSv1WCUcJml5KibJw',
                alt: 'Ron Norton, Fundador y CEO',
                className: style.ceo__image
              }}
              title={{
                className: style.ceo__name,
                value: 'Ron Norton — Fundador & CEO.'
              }}
              subTitle={{
                className: style.ceo__experience,
                value: 'Más de 40 años de experiencia en la enseñanza'
              }}
            />

            <header>
              <h2 className={style.ceo__title}>
                Aprenda de los <span className={style.block}>profesionales.</span>
              </h2>
              <p className={style.ceo__text}>
                Rápidamente ganará confianza en su inglés y mejorará su vocabulario,
                comprensión al escuchar, y habilidades para hablar.
              </p>
            </header>
          </div>
        </div>
      </article>

      <article className={style.student}>
        <header>
          <h2 className={style.student__title}>
            Lo que dicen nuestros estudiantes.
          </h2>
        </header>

        <div className={style.student__container}>
          <div className={style.student__content}>
            <div>
              <div className={style.reverse}>
                <p className={style.student__text}>
                  Este curso de inglés me ha ayudado a desarrollar habilidades lingüísticas esenciales y
                  me ha hecho sentir que puedo adaptarme sin importar dónde me encuentre.
                </p>
                <Figure
                  className={style.student__figure}
                  img={{
                    src: '1K2b9N4S2g1mfzuEZwb2tj11ulE1ZfJmf',
                    alt: 'Kelvin Henríquez',
                    className: style.student__image
                  }}
                  title={{
                    className: style.student__name,
                    value: 'Kelvin Henríquez'
                  }}
                  subTitle={{
                    className: style.student__country,
                    value: 'Desde Lima, Perú'
                  }}
                />
              </div>

              <div className={style.reverse}>
                <p className={style.student__text}>
                  Un título de inglés en línea ahorra tiempo, y realmente hay muchos gastos generales cuando
                  necesitas ir presencial a una escuela. Si lo haces online, puedes hacerlo desde casa.
                  Yo pude completar el curso mientras trabajaba a tiempo completo en mi trabajo actual.
                </p>
                <Figure
                  className={style.student__figure}
                  img={{
                    src: '1LMxe5rk0GE6wMk-JkvVnf7V_3Z428SEo',
                    alt: 'Nelson Torres',
                    className: style.student__image
                  }}
                  title={{
                    className: style.student__name,
                    value: 'Nelson Torres'
                  }}
                  subTitle={{
                    className: style.student__country,
                    value: 'Desde Puerto Rico'
                  }}
                />
              </div>
            </div>

            <div>
              <div className={style.reverse}>
                <p className={style.student__text}>
                  Disfruté mucho al tomar el curso. Los cuestionarios me proporcionaron una experiencia
                  práctica y muy útil. Aprender en Easy Online English me ha dado la confianza y la capacidad
                  de sobresalir en mi carrera. Me encanta esta sensación.
                </p>
                <Figure
                  className={style.student__figure}
                  img={{
                    src: '1SPJBctDwbICQBmEiP8kGXtr0GI1Q_w5M',
                    alt: 'María Swan',
                    className: style.student__image
                  }}
                  title={{
                    className: style.student__name,
                    value: 'María Swan'
                  }}
                  subTitle={{
                    className: style.student__country,
                    value: 'Desde España'
                  }}
                />
              </div>

              <div className={style.reverse}>
                <p className={style.student__text}>
                  "Apliqué directamente los conceptos y habilidades que aprendí en el curso a un nuevo y
                  emocionante proyecto en el trabajo. Es muy motivador en el momento cuando puedes ver los
                  resultados hechos realidad.
                </p>
                <div>
                  <Figure
                    className={style.student__figure}
                    img={{
                      src: '1WiT1Q_2Ftm-pmdEzREZVoIA1lsGewhw3',
                      alt: 'Fred Sánchez',
                      className: style.student__image
                    }}
                    title={{
                      className: style.student__name,
                      value: 'Fred Sánchez'
                    }}
                    subTitle={{
                      className: style.student__country,
                      value: 'Desde Rep. Dom.'
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>

      <article className={style.join}>
        <div className={style.join__container}>
          <div className={style.join__content}>
            <header>
              <h2 className={style.join__title}>
                ¡Únete a nuestros estudiantes felices!
              </h2>
              <p className={style.join__text}>
                Da el siguiente paso hacia tus objetivos personales y profesionales estudia con nosotros.
                Nuestro programa es flexible y personalizado, para que puedas aprender a tu propio ritmo y según tus necesidades.
                ¡Inscríbete hoy y comienza tu camino hacia el éxito en inglés!
              </p>
              <div className={style.join__bottom}>
                <Link
                  to={buttonUrl}
                  className={style.join__button}
                >
                  Comienza Ahora
                </Link>
              </div>
            </header>
          </div>
        </div>
      </article>

      <article className={style.start}>
        <div className={style.start__container}>
          <div className={style.start__content}>
            <div className={style.start__top}>
              <h2 className={style.start__title}>
                ¿Cómo empiezo en EasyOnlineEnglish?
              </h2>
              <p className={style.start__text}>
                Da el próximo paso hacia tus metas personales y profesionales, estudia con nosotros.
                Nuestro programa es flexible y personalizado, para que puedas aprender a tu propio ritmo y según tus necesidades.
                ¡Inscríbete hoy y empieza el camino hacia el éxito con el Inglés!

                {user === null && (
                  <>
                    <Link to="plan" className={style.block}>Inscríbete Ahora</Link>
                    <Link to="login" className={style.block}>¿Ya tienes tu cuenta con nosotros?</Link>
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      </article>
    </section>
  );
}

export default Home;
