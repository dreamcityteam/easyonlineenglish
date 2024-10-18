import React from 'react';
import style from './style.module.sass';
import Image from '../../../components/Image';
import Form from '../../../components/Form';
import { inputs } from './data';

const Section6: React.FC = (): JSX.Element => {
  const onForm = (data: any): void => {}

  return (
    <article className={style.home}>
      <div className={style.home__wrapper}>
        <div>
          <header className={style.home__header}>
            <h2>¡Mantente Informado!</h2>
            <p>
              Subscríbete a nuestro boletín de noticias y promociones.
              Descubre nuevos tips para aprender Inglés. ¡Es fácil y divertido!
            </p>
          </header>
          <div className={style.home__formContainer}>
            <Form
              api="suscribete"
              buttonText="Suscribirse"
              fields={inputs}
              onData={onForm}
            />
          </div>
        </div>
        <div className={style.home__imageContainer}>
          <Image
            alt="Email notification icon"
            path="icons/email-pqUi127oepcd6VCK1Ov3mMnB4qHRH9.png"
            className={style.home__image}
          />
          <Image
            alt="Email notification shadow icon"
            path="icons/shadow-7AaAnWRYUijCOIbfdafW9PWrhrzDYq.jpg"
            className={style.home__image}
          />
        </div>
      </div>
    </article>
  );
}

export default Section6;
