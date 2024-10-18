import React from 'react';
import Form from '../../../components/Form';
import { inputs } from './data';
import style from './style.module.sass';

const ResetPassword: React.FC = (): JSX.Element => {
  const onData = (data: any): void => {}

  return (
    <section className={style.ResetPassword}>
      <Form
        title="Contraseña"
        api="send-email-reset-password"
        buttonText="Enviar"
        fields={inputs}
        onData={onData}
        successMessage="Se ha enviado un correo electrónico de verificación."
      />
    </section>
  );
};

export default ResetPassword;
