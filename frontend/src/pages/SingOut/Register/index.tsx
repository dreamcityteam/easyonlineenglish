import React, { useState } from 'react';
import Form from '../../../components/Form';
import { inputs } from './data';
import style from './style.module.sass';
import RegistrationSuccess from './RegistrationSuccess';

const Register: React.FC = (): JSX.Element => {
  const [isRegistrationSuccess, setIsRegistrationSuccess] = useState<boolean>(false);

  const onData = (data: any): void => {
    setIsRegistrationSuccess(true);
  }

  return (
    <section className={style.register}>
      {isRegistrationSuccess
        ? <RegistrationSuccess />
        : <Form
          api="sign-up"
          title="Registro"
          buttonText="Regístrate"
          fields={inputs}
          onData={onData}
        />
      }

    </section>
  );
}

export default Register;
