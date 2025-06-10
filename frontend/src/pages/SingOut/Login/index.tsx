import React, { useContext } from 'react';
import { Link, NavigateFunction, useNavigate } from 'react-router-dom';
import Form from '../../../components/Form';
import { inputs } from './data';
import context from '../../../global/state/context';
import { CLEAN_CACHE, SET_USER } from '../../../global/state/actionTypes';
import style from './style.module.sass';
import { isAdmin, isFree } from '../../../tools/function';
import Head from './Head';

const Login: React.FC = (): JSX.Element => {
  const [_, dispatch] = useContext(context);
  const navigate: NavigateFunction = useNavigate();

  const onData = (user: any): void => {
    const isUserExemptFromPlan: boolean = isAdmin(user) || isFree(user);
    const destinationUrl: string = user.payment.isPayment || isUserExemptFromPlan ? '/courses' : '/plan';

    navigate(destinationUrl);
    dispatch({ type: CLEAN_CACHE });
    dispatch({ type: SET_USER, payload: user });
  }

  return (
    <>
      <Head />
      <section className={style.login}>
        <div>
          <Form
            api="login"
            buttonText="Log in"
            fields={inputs}
            onData={onData}
            resetPassword={{
              label: '¿Has olvidado la contraseña?',
              url: '/reset-password'
            }}
            title="Login"
            google="signin_with"
          />
        </div>
      </section>
    </>
  );
};

export default Login;
