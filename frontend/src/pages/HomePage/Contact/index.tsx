import React from 'react';
import Form from '../../../components/Form';
import Header from '../../../components/Header';
import { infos, inputs } from './data';
import style from './style.module.sass';
import GoogleDriveImage from '../../../components/Image';
import { HTTP_STATUS_CODES } from '../../../tools/constant';

const Contact: React.FC = () => {
  const onData = (payload: any, updateState: (key: string, field: any) => void): void => {
    const field = {
      validation: {
        isNotValid: true,
        serverErrorMessage: '',
        successMessage: ''
      }
    };

    if (payload.response.statusCode === HTTP_STATUS_CODES.OK) {
      field.validation.successMessage = 'Mensaje enviado.';
      updateState('message', field);
    } else if (payload.response.statusCode === HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR) {
      field.validation.serverErrorMessage = 'Su mensaje no pudo ser enviado.';
      updateState('message', field);
    }
  }

  return (
    <section>
      <article className={style.form}>
        <div className={style.form__container}>
          <Header
            title="¿Necesita Ayuda?"
            subTitle="¡Nosotros podemos ayudarle!"
          />
          <Form
            api="contanct"
            buttonText="Enviar Mensaje"
            inputs={inputs}
            onData={onData}
          />
        </div>
      </article>

      <article className={style.contact}>
        {infos.map(({ googleId, title, info }, index: number): JSX.Element => (
          <ul className={style.contact__infos} key={index}>
            <li className={style.contact__info} >
              <GoogleDriveImage id={googleId} alt={title} />
            </li>
            <li className={style.contact__info} >
              <h3>{title}</h3>
            </li>
            <li className={style.contact__info} >
              <span>{info}</span>
            </li>
          </ul>
        ))}
      </article>


      <article className={style.fag}>
        <header>
          <h2 className={style.fag__title}>
            Lo que dicen nuestros estudiantes.
          </h2>
        </header>

        <div className={style.fag__container}>
          <div className={style.fag__content}>
            <div>
              <div className={style.fag__texts}>
                <h2 className={style.fag__question}>1. ¿Qué es EasyOnlineEnglish?</h2>
                <p className={style.fag__text}>
                  Es un curso de Ingles 100% online basado en la propuesta de Inglés como segunda lengua.re.
                </p>
              </div>

              <div className={style.fag__texts}>
                <h2 className={style.fag__question}>2. ¿Cómo me puedo inscribirme?</h2>
                <p className={style.fag__text}>
                  Ingresa tus datos en el formulario de inscripción de nuestra web. Haciendo click en el botón de login y luego ir a registro.
                </p>
              </div>
            </div>

            <div>
              <div className={style.fag__texts}>
                <h2 className={style.fag__question}>3. ¿Puedo empezar como principiante?</h2>
                <p className={style.fag__text}>
                  Disfruté mucho al tomar el curso. Los cuestionarios me proporcionaron una experiencia
                  práctica y muy útil. Aprender en Easy Online English me ha dado la confianza y la capacidad
                  de sobresalir en mi carrera. Me encanta esta sensación.
                </p>
              </div>

              <div className={style.fag__texts}>
                <h2 className={style.fag__question}>4. ¿En cuanto tiempo voy a aprender inglés?</h2>
                <p className={style.fag__text}>
                  Puedes avanzar tan rápido como quieras. Nuestra plataforma te permite aprender a tu ritmo gracias a nuestras clases ilimitadas y las herramientas interactivas te permiten practicar cuando tú quieras.
                </p>
              </div>
            </div>
          </div>
        </div>
      </article>
    </section>
  );
}

export default Contact;
