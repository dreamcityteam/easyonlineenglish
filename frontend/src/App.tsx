import React, { useEffect, useReducer, useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import RouterHomePage from './routers/HomePage';
import context from './global/state/context';
import initialState from './global/state/state';
import reducer from './global/state/reduce';
import { SET_GOOGLE_ANALITICS, SET_USER } from './global/state/actionTypes';
import RouterStudent from './routers/Student';
import { getData, initGoogleAnalytics, isFree, isStudent } from './tools/function';
import { ROLE } from './tools/constant';
import Navigator from './components/Navigator';
import Footer from './components/Footer';
import Loading from './components/Loading';
import Admin from './routers/Admin';

const App: React.FC = (): JSX.Element => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isUserDataComplete, setIsUserDataComplete] = useState<boolean>(false);

  useEffect(() => {
    dispatch({ type: SET_GOOGLE_ANALITICS, payload: { value: initGoogleAnalytics() }});
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

  return (
    <>
      <context.Provider value={[state, dispatch]}>
        <Router>
          <Navigator />
          {state.user === null && isUserDataComplete && <RouterHomePage />}
          {isStudent(state?.user) || isFree(state?.user) 
            ? <RouterStudent user={state.user} />
            : null
          }
          {state?.user?.role === ROLE.ADMIN && <Admin />}
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
