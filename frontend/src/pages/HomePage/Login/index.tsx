import React, { useContext, useState } from 'react';
import { Link, NavigateFunction, useNavigate } from 'react-router-dom';
import Form from '../../../components/Form';
import { inputs } from './data';
import context from '../../../global/state/context';
import { SET_USER } from '../../../global/state/actionTypes';
import style from './style.module.sass';

const Login: React.FC = () => {
  const [_, dispatch] = useContext(context);
  const [text, setText] = useState<string>('');
  const navigate: NavigateFunction = useNavigate();

  const onData = (payload: any): void => {
    setText('');

    if (payload.response.statusCode === 400) {
      setText('La dirección de correo electrónico o la contraseña son incorrectas.');
    } else if (payload.response.statusCode === 200) {
      navigate('/courses');
      dispatch({ type: SET_USER, payload: payload.response.data });
    } else if (payload.response.statusCode === 500) {
      setText('Tenemos problemas para iniciar sesión. Por favor, inténtalo de nuevo más tarde.');
    }
  }

  return (
    <section className={style.login}>
      <div>
        <header>
          <h1>Log in</h1>
        </header>
        <div>
          <span className={style.login__error}>{text}</span>
        </div>
        <Form
          api="auth"
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
