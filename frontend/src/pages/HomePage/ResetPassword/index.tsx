import React from 'react';
import Form from '../../../components/Form';
import { inputs } from './data';
import style from './style.module.sass';
import { HTTP_STATUS_CODES } from '../../../tools/constant';

const ResetPassword: React.FC = (): JSX.Element => {
  const onData = (payload: any, updateState: (key: string, field: any) => void): void => {
    const { statusCode, message = '' } = payload.response;
    const field = {
      validation: {
        isNotValid: true,
        serverErrorMessage: '',
        successMessage: ''
      }
    };

   if (message.includes('existe')) {
      field.validation.serverErrorMessage = message;
      updateState('email', field);
    } else if (statusCode === HTTP_STATUS_CODES.OK) {
      field.validation.successMessage = 'Se ha enviado un correo electrónico de verificación.';
      updateState('email', field);
    } else if (statusCode === HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR) {
      field.validation.serverErrorMessage = 'Se produjo un error al intentar mas tarde.';
      updateState('email', field);
    }
  }

  return (
    <section className={style.ResetPassword}>
      <div>
        <header>
          <h1>Restablecer contraseña</h1>
        </header>
        <Form
          api="send-email-reset-password"
          buttonText="Enviar"
          inputs={inputs}
          onData={onData}
        />
      </div>
    </section>
  );
};

export default ResetPassword;
