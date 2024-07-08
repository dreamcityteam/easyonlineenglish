import React, { useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import style from './style.module.sass';
import context from '../../global/state/context';

const page404: React.FC = (): JSX.Element => {
  const [{ user }] = useContext(context);
  const redirect = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const canRedirectStudentPendingPayment = (
      (location.pathname.includes('/course') || location.pathname === '/courses') && user && !user.payment.isPayment
    );

    canRedirectStudentPendingPayment && redirect('/plan');
  }, [user]);

  return (
    <section className={style.page404}>
      <div className={style.page404__container}>
        <div className={style.page404__content}>
          <h3 className={style.page404__subTitle}>¡Ups! Página no encontrada</h3>
          <h1 className={style.page404__title}><span>4</span><span>0</span><span>4</span></h1>
        </div>
        <h2>Lo sentimos, pero la página que solicitaste no se ha encontrado.</h2>
      </div>
    </section>
  )
};

export default page404;
