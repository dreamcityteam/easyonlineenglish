import React, { useContext } from 'react';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import Form from '../../../components/Form';
import { inputs } from './data';
import style from './style.module.sass';
import { SET_USER } from '../../../global/state/actionTypes';
import { State } from '../../../global/state/type';
import context from '../../../global/state/context';
import { HTTP_STATUS_CODES } from '../../../tools/constant';

const Register: React.FC = () => {
  const [_, dispatch] = useContext<[State, any]>(context);
  const navigate: NavigateFunction = useNavigate();

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
      dispatch({ type: SET_USER, payload: data });
      navigate('/courses');
    } else if (statusCode === HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR) {
      field.validation.serverErrorMessage = 'Se produjo un error al intentar guardar los datos.';
      updateState('password', field);
    }
  }

  return (
    <section className={style.register}>
      <div>
        <header>
          <h1>Inscripción</h1>
        </header>
        <Form
          api="register"
          buttonText="Inscribirme ahora"
          inputs={inputs}
          onData={onData}
        />
      </div>
    </section>
  );
}

export default Register;
