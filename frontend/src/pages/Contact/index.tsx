import React from 'react';
import Form from '../../components/Form';
import { infos, inputs } from './data';
import style from './style.module.sass';
import Image from '../../components/Image';
import { Info } from './type';
import Head from './Head';

const Contact: React.FC = () => {
  const onForm = (data: any): void => {
    console.log(data);
  }

  return (
    <>
      <Head />
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
              api="contanct"
              buttonText="Enviar Mensaje"
              fields={inputs}
              onData={onForm}
              title="Contacto"
              successMessage="Su mensaje se ha enviado exitosamente."
            />
          </div>
        </article>
      </section>
    </>
  );
}

export default Contact;
