import React from 'react';
import Form from '../../components/Form';
import { infos, inputs } from './data';
import style from './style.module.sass';
import { HTTP_STATUS_CODES } from '../../tools/constant';
import Image from '../../components/Image';
import { Info } from './type';

const Contact: React.FC = () => {
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
      field.validation.successMessage = 'Mensaje enviado.';
      updateState('message', field);
    } else if (statusCode === HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR) {
      field.validation.serverErrorMessage = 'Su mensaje no pudo ser enviado.';
      updateState('message', field);
    }
  }

  return (
    <section>
      <article className={style.contact}>
        <div className={style.contact__container}>
          <header className={style.contact__header}>
            <h1>Contáctate con nosotros</h1>
          </header>
          <ul className={style.contact__contact}>
            {infos.map(({ path, alt, description, title }: Info, index: number): JSX.Element => (
              <li key={index}>
                <Image
                  path={path}
                  alt={`${alt} icon`}
                />
                <div>
                  <strong>{title}:</strong>
                  <span>{description}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <Form
            canCleanInput
            api="contanct"
            buttonText="Enviar Mensaje"
            inputs={inputs}
            onData={onForm}
          />
        </div>
      </article>
    </section>
  );
}

export default Contact;
