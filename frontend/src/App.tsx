import React, { useEffect, useReducer, useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import RouterHomePage from './routers/HomePage';
import context from './global/state/context';
import initialState from './global/state/state';
import reducer from './global/state/reduce';
import { SET_USER } from './global/state/actionTypes';
import RouterStudent from './routers/Student';
import { getData, isAdmin, isFree, isStudent } from './tools/function';
import Navigator from './components/Navigator';
import Footer from './components/Footer';
import Loading from './components/Loading';
import Admin from './routers/Admin';
import WhatsAppFloat from './components/Whatsap';

const App: React.FC = (): JSX.Element => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isUserDataComplete, setIsUserDataComplete] = useState<boolean>(false);

  useEffect(() => {
  }, [window.location.pathname]);

  useEffect(() => {
    setUser();
  }, []);

  const setUser = async (): Promise<void> => {
    await getData({
      service: { method: 'post', endpoint: 'auth' },
      modal: { dispatch, text: 'Iniciando sesión' },
      success: (data): void => {
        data && dispatch({ type: SET_USER, payload: data });
      }
    });

    setIsUserDataComplete(true);
  };

  const canShowStudentSection = (): boolean =>
    isStudent(state?.user) || isFree(state?.user);

  return (
    <>
      <context.Provider value={[state, dispatch]}>
        <Router>
          <Navigator />
          {state.user === null && isUserDataComplete && <RouterHomePage />}
          {canShowStudentSection()
            ? <RouterStudent isPayment={state.user?.payment.isPayment || isFree(state?.user)} />
            : null
          }
          {isAdmin(state?.user) && <Admin />}
          <Footer />
        </Router>
      </context.Provider>
      <Loading
        state={[state.loading.canShow, () => {}]}
        text={state.loading.text}
      />
      <WhatsAppFloat 
        phoneNumber="18495058393"
        message = "Hola, estoy interesado en tus servicios" 
      />
    </>
  );
};

export default App;
