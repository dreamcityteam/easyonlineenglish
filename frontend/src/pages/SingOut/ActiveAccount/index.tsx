import React, { useContext, useEffect } from 'react';
import { NavigateFunction, useNavigate, useParams } from 'react-router-dom';
import { getData } from '../../../tools/function';
import context from '../../../global/state/context';
import { SET_USER } from '../../../global/state/actionTypes';

const ActiveAccount: React.FC = () => {
  const { token } = useParams<string>();
  const [, dispatch] = useContext(context);
  const navigate: NavigateFunction = useNavigate();

  useEffect(() => {
    checkToken();
  }, []);

  const checkToken = async (): Promise<void> => {
    await getData({
      service: { method: 'post', endpoint: 'student-active-account' },
      token,
      modal: { dispatch, text: 'Verificando autenticación' },
      success: (data: any): void => {
        dispatch({ type: SET_USER, payload: data });
        navigate('/plan');
      },
      error: () => {
        navigate('/');
      }
    });
  }

  return (
    <section>
      <div>
        <header>
          <h1>Este enlace ha expirado o no es válido.</h1>
        </header>
      </div>
    </section>
  );
}

export default ActiveAccount;
