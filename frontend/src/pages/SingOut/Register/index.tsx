import React, { useContext, useState } from 'react';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import Form from '../../../components/Form';
import { inputs } from './data';
import style from './style.module.sass';
import RegistrationSuccess from './RegistrationSuccess';
import context from '../../../global/state/context';
import { CLEAN_CACHE, SET_USER } from '../../../global/state/actionTypes';

const Register: React.FC = (): JSX.Element => {
  const [_, dispatch] = useContext(context);
  const [isRegistrationSuccess, setIsRegistrationSuccess] = useState<boolean>(false);
  const navigate: NavigateFunction = useNavigate();

  const onData = (data: any): void => {
    const { isGoogle, ...user } = data;

    if (isGoogle) {
      navigate('/')
      dispatch({ type: CLEAN_CACHE });
      dispatch({ type: SET_USER, payload: user });
    } else {
      setIsRegistrationSuccess(true);
    }
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
          google="signup_with"
        />
      }
    </section>
  );
}

export default Register;
