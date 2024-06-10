import React, { useEffect, useReducer, useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import ReactGA from 'react-ga';
import RouterHomePage from './routers/HomePage';
import context from './global/state/context';
import initialState from './global/state/state';
import reducer from './global/state/reduce';
import { SET_USER } from './global/state/actionTypes';
import RouterStudent from './routers/Student';
import { getData } from './tools/function';
import { ROLE } from './tools/constant';
import Navigator from './components/Navigator';
import Footer from './components/Footer';
import Loading from './components/Loading';

ReactGA.initialize('G-464CENS3PK');

const App: React.FC = (): JSX.Element => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isUserDataComplete, setIsUserDataComplete] = useState<boolean>(false);

  useEffect(() => {
    ReactGA.pageview(window.location.pathname + window.location.search);
    setUser();
  }, []);

  const setUser = async (): Promise<void> => {
    await getData({
      service: { method: 'post', endpoint: 'auth' },
      modal: { dispatch, text: 'Iniciando sesión' },
      success: (data): void => {
        dispatch({ type: SET_USER, payload: data });
      }
    });

    setIsUserDataComplete(true);
  };

  return (
    <>
      <context.Provider value={[state, dispatch]}>
        <Router>
          <Navigator />
          {state.user === null && isUserDataComplete && <RouterHomePage />}
          {state?.user?.role === ROLE.STUDENT && <RouterStudent isPayment={state.user.payment.isPayment} />}
          <Footer />
        </Router>
      </context.Provider>
      <Loading
        canShow={state.loading.canShow}
        text={state.loading.text}
      />
    </>
  );
};

export default App;
