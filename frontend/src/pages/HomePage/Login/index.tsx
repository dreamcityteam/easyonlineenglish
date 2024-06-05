import React, { useContext, useState } from 'react';
import { Link, NavigateFunction, useNavigate } from 'react-router-dom';
import Form from '../../../components/Form';
import { inputs } from './data';
import context from '../../../global/state/context';
import { CLEAN_CACHE, SET_USER } from '../../../global/state/actionTypes';
import style from './style.module.sass';
import { HTTP_STATUS_CODES } from '../../../tools/constant';

const Login: React.FC = () => {
  const [_, dispatch] = useContext(context);
  const [text, setText] = useState<string>('');
  const navigate: NavigateFunction = useNavigate();

  const onData = ({ response: { statusCode, data } }: any): void => {
    setText('');

    if (statusCode === HTTP_STATUS_CODES.NOT_FOUND) {
      setText('La dirección de correo electrónico o la contraseña son incorrectas.');
    } else if (statusCode === HTTP_STATUS_CODES.OK) {
      navigate(data.isPayment ? '/courses' : '/plan');
      dispatch({ type: CLEAN_CACHE });
      dispatch({ type: SET_USER, payload: data });
    } else if (statusCode === HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR) {
      setText('Tenemos problemas para iniciar sesión. Por favor, inténtalo de nuevo más tarde.');
    }
  }

  return (
    <section className={style.login}>
      <div>
        <Form
          api="auth"
          title="Login"
          errorMessage={text}
          buttonText="Log in"
          inputs={inputs}
          onData={onData}
        />
        <Link className={style.login__link} to="/reset-password">
          ¿Has olvidado la contraseña?
        </Link>
      </div>
    </section>
  );
};

export default Login;
