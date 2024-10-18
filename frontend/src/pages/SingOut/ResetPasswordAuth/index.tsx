import React, { useContext, useEffect, useState } from 'react';
import { NavigateFunction, useNavigate, useParams } from 'react-router-dom';
import Form from '../../../components/Form';
import { inputs } from './data';
import context from '../../../global/state/context';
import { getData } from '../../../tools/function';
import style from './style.module.sass';

const ResetPasswordAuth: React.FC = (): JSX.Element => {
  const { token } = useParams<string>();
  const [isToken, setIsToken] = useState<boolean>(false);
  const [_, dispatch] = useContext(context);
  const navigate: NavigateFunction = useNavigate();

  useEffect(() => {
    checkToken();
  }, []);

  const checkToken = async (): Promise<void> => {
    await getData({
      service: { method: 'get', endpoint: 'reset-password-auth' },
      token,
      modal: { dispatch, text: 'Verificando autenticación' },
      success: (): void => setIsToken(true),
    });
  }

  const onData = (data: any): void => {
    navigate('/login');
  }

  return (
    <section className={style.resetPassword}>
      {isToken ? (
        <div className={style.resetPassword__form}>
          <Form
            title="Contraseña"
            api="reset-password"
            buttonText="Enviar"
            fields={inputs}
            onData={onData}
          />
        </div>
      ) : (
        <div>
          <header>
            <h1>Este enlace ha expirado o no es válido.</h1>
          </header>
        </div>
      )}
    </section>
  );
};

export default ResetPasswordAuth;
