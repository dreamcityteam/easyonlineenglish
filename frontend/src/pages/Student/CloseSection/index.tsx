import React, { useContext, useEffect } from 'react';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { CLEAN_CACHE, SIGN_OUT } from '../../../global/state/actionTypes';
import { getData } from '../../../tools/function';
import context from '../../../global/state/context';

const CloseSection: React.FC = (): null => {
  const [_, dispatch] = useContext(context);
  const navigate: NavigateFunction = useNavigate();

  useEffect(() => {
    closeSection();
  }, []);

  const closeSection = async (): Promise<void> => {
    await getData({
      service: { method: 'post', endpoint: 'logout' },
      modal: { dispatch, text: 'Cerrando sesión' },
      success: (data): void => {
        dispatch({ type: CLEAN_CACHE });
        dispatch({ type: SIGN_OUT, payload: data });
        navigate('/');
      }
    });
  }

  return null;
}

export default CloseSection;
