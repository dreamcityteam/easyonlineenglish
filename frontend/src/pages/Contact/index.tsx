import React from 'react';
import Form from '../../components/Form';
import { inputs } from './data';
import style from './style.module.sass';
import { HTTP_STATUS_CODES } from '../../tools/constant';
import { getPublicFilePath } from '../../tools/function';

const Contact: React.FC = () => {
  const onData = ({ response: { statusCode } }: any, updateState: (key: string, field: any) => void): void => {
    const field = {
      validation: {
        isNotValid: true,
        serverErrorMessage: '',
        successMessage: ''
      }
    };

    if (statusCode === HTTP_STATUS_CODES.OK) {
      field.validation.successMessage = 'Mensaje enviado.';
      updateState('message', field);
    } else if (statusCode === HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR) {
      field.validation.serverErrorMessage = 'Su mensaje no pudo ser enviado.';
      updateState('message', field);
    }
  }

  return (
    <section>
      <article className={style.form}>
        <div className={style.form__container}>
          <header>
            <h1>Contáctate con nosotros</h1>
          </header>
          <ul className={style.form__contact}>
            <li>
              <img src={getPublicFilePath('icons/phone-SdeywUetntw1CxsoJbOPwI3oFumj2J.avif')} />
              <div>
                <strong>Teléfono:</strong>
                <span>+1 (849) 410-9664</span>
              </div>
            </li>
            <li>
              <img src={getPublicFilePath('icons/email-jNdh3RwRu4df5LmIYENJtnpGq0h3QG.avif')} />
              <div>
                <strong>Correo:</strong>
                <span>support@easyonlineenglish.com</span>
              </div>
            </li>
            <li>
              <img src={getPublicFilePath('icons/location-FZAyKeKVwsTA89nlrrPndy8HU0s9A2.avif')} />
              <div>
                <strong>Localización:</strong>
                <span>Cabarete, Puerto Plata, República Dominicana.</span>
              </div>
            </li>
          </ul>
        </div>
        <div className={style.form__container}>
          <Form
            canCleanInput
            api="contanct"
            buttonText="Enviar Mensaje"
            inputs={inputs}
            onData={onData}
          />
        </div>
      </article>
    </section>
  );
}

export default Contact;
