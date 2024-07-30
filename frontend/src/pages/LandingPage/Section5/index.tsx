import React from 'react';
import style from './style.module.sass';
import Image from '../../../components/Image';
import Form from '../../../components/Form';
import { inputs } from './data';
import { HTTP_STATUS_CODES } from '../../../tools/constant';

const Section6: React.FC = (): JSX.Element => {
  const onForm = (
    { response: { statusCode } }: any,
    updateState: (key: string, field: any) => void
  ): void => {
    const field = {
      validation: {
        isNotValid: true,
        serverErrorMessage: '',
        successMessage: ''
      }
    };

    if (statusCode === HTTP_STATUS_CODES.OK) {
      field.validation.successMessage = 'Suscripción enviada.';
      updateState('email', field);
    } else if (statusCode === HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR) {
      field.validation.serverErrorMessage = 'No pudimos enviar la suscripción.';
      updateState('email', field);
    }
  }

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
              canCleanInput
              inputs={inputs}
              onData={onForm}
            />
          </div>
        </div>
        <div className={style.home__imageContainer}>
          <Image
            alt="Email notification icon"
            path="icons/email-2-NOwmYZsjmCWwtVMn6E8oYUro4Wi7eJ.avif"
            className={style.home__image}
          />
          <Image
            alt="Email notification shadow icon"
            path="home/shadow-WFRhXonJVV6SR5Rx6bWQQPITHrFRBn.avif"
            className={style.home__image}
          />
        </div>
      </div>
    </article>
  );
}

export default Section6;
