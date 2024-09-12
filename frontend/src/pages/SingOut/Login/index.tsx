import React, { useContext, useState } from 'react';
import { Link, NavigateFunction, useNavigate } from 'react-router-dom';
import Form from '../../../components/Form';
import { inputs } from './data';
import context from '../../../global/state/context';
import { CLEAN_CACHE, SET_USER } from '../../../global/state/actionTypes';
import style from './style.module.sass';
import { HTTP_STATUS_CODES } from '../../../tools/constant';
import { isAdmin, isFree } from '../../../tools/function';
import Head from './Head';

const Login: React.FC = (): JSX.Element => {
  const [{ googleAnalytics }, dispatch] = useContext(context);
  const [text, setText] = useState<string>('');
  const navigate: NavigateFunction = useNavigate();

  const onData = ({ response: { statusCode, data: user, message } }: any): void => {
    setText('');

    if (message === 'deleted') {
      setText('Esta cuenta ha sido eliminada.');

    } else if (message === 'actived') {
      setText('Esta cuenta no ha sido activada.');

    } else if (statusCode === HTTP_STATUS_CODES.NOT_FOUND) {
      setText('La dirección de correo electrónico o la contraseña son incorrectas.');

    } else if (statusCode === HTTP_STATUS_CODES.OK) {
      const isUserExemptFromPlan: boolean = isAdmin(user) || isFree(user);
      let destinationUrl: string = user.payment.isPayment || isUserExemptFromPlan ? '/courses' : '/plan';

      navigate(destinationUrl);
      dispatch({ type: CLEAN_CACHE });
      dispatch({ type: SET_USER, payload: user });

      if (!isUserExemptFromPlan) {
        googleAnalytics('event', 'login', {
          'event_category': 'Login',
          'event_label': 'Iniciar sección'
        });
      }
    } else if (statusCode === HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR) {
      setText('Tenemos problemas para iniciar sesión. Por favor, inténtalo de nuevo más tarde.');
    }
  }

  return (
    <>
      <Head />
      <section className={style.login}>
        <div className={style.login__container}>
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
    </>
  );
};

export default Login;
