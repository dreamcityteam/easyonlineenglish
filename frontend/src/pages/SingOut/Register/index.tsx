import React, { useState } from 'react';
import Form from '../../../components/Form';
import { inputs } from './data';
import style from './style.module.sass';
import { HTTP_STATUS_CODES } from '../../../tools/constant';
import RegistrationSuccess from './RegistrationSuccess';

const Register: React.FC = (): JSX.Element => {
  const [isRegistrationSuccess, setIsRegistrationSuccess] = useState<boolean>(false);

  const onData = (payload: any, updateState: (key: string, field: any) => void): void => {
    const { statusCode, message = '', data } = payload.response;
    const field = {
      validation: {
        isNotValid: true,
        serverErrorMessage: ''
      }
    };

    if (message.includes('username')) {
      field.validation.serverErrorMessage = 'Este usuario ya está en uso.';
      updateState('username', field);
    } else if (message.includes('email')) {
      field.validation.serverErrorMessage = 'Este correo electrónico ya está en uso.';
      updateState('email', field);
    } else if (statusCode === HTTP_STATUS_CODES.OK) {
      setIsRegistrationSuccess(true);
    } else if (statusCode === HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR) {
      field.validation.serverErrorMessage = 'Se produjo un error al intentar guardar los datos.';
      updateState('password', field);
    }
  }

  return (
    <section className={style.register}>
      {isRegistrationSuccess
        ? <RegistrationSuccess />
        : <Form
          api="register"
          title="Registro"
          buttonText="Registrarse"
          inputs={inputs}
          onData={onData}
        />
      }

    </section>
  );
}

export default Register;
