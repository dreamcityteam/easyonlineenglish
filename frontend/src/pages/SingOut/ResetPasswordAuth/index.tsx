import React, { useContext, useEffect, useState } from 'react';
import { NavigateFunction, useNavigate, useParams } from 'react-router-dom';
import Form from '../../../components/Form';
import { inputs } from './data';
import { HTTP_STATUS_CODES } from '../../../tools/constant';
import context from '../../../global/state/context';
import { getData } from '../../../tools/function';
import style from './style.module.sass';

const ResetPasswordAuth: React.FC = (): JSX.Element => {
  const { token } = useParams<string>();
  const [isToken, setIsToken] = useState<boolean>(false);
  const [, dispatch] = useContext(context);
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

  const onData = (payload: any, updateState: (key: string, field: any) => void): void => {
    const { statusCode } = payload.response;
    const field = {
      validation: {
        isNotValid: true,
        serverErrorMessage: ''
      }
    };

    if (statusCode === HTTP_STATUS_CODES.OK) {
      navigate('/login');

    } else if (statusCode === HTTP_STATUS_CODES.UNAUTHORIZED) {
      setIsToken(false);

    } else if (statusCode === HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR) {
      field.validation.serverErrorMessage = 'Se produjo un error al intentar mas tarde.';
      updateState('password', field);
    }
  }

  return (
    <section className={style.resetPassword}>
      {isToken ? (
        <div className={style.resetPassword__form}>
          <Form
            title="Contraseña"
            api="reset-password"
            token={token}
            buttonText="Enviar"
            inputs={inputs}
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
