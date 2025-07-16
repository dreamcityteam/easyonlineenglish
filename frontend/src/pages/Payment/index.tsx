
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Cards from 'react-credit-cards-2';
import 'react-credit-cards-2/dist/es/styles-compiled.css';
import style from './style.module.sass';
import context from '../../global/state/context';
import { CLEAN_CACHE, SET_USER } from '../../global/state/actionTypes';
import { PAYMENT_METHOD } from '../../tools/constant';
import AllTerms from '../Terms/All';
import SuccessPayment from './SuccessModal';
import PayPalSubcription from './PayPal/Subscription';
import CancelSubscription from './PayPal/CancelSubscription';

const PaymentForms: React.FC = () => {
  const { paymentMethod = '' } = useParams<string>();
  const [canOpenModal, setCanOpenModal] = useState<boolean>(false);
  const [paymentTitle, setPaymentTitle] = useState<string>();
  const [{ user }, dispatch] = useContext(context);
  const redirect = useNavigate();

  useEffect(() => {
    if (['1', '2', '3'].includes(paymentMethod)) {
      setPaymentTitle(PAYMENT_METHOD[Number(paymentMethod)].DESCRIPTION);
    } else {
      redirect('/plan');
    }
  }, []);


  const onCompletedPayment = (payment: any): void => {
    setCanOpenModal(true);
    dispatch({ type: CLEAN_CACHE });
    dispatch({
      type: SET_USER,
      payload: {
        ...user,
        payment: {
          isPayment: true,
          plan: paymentMethod,
          dateEnd: payment.dateEnd,
          dateStart: payment.dateStart,
          orderId: payment.orderId,
          status: payment.status
        },
      },
    });
  }

  const getCurrentDate = useCallback((): string => {
    const currentDate: Date = new Date();
    const getZero = (number: number) => number <= 9 ? `0${number}` : number;

    return `${getZero(currentDate.getMonth() + 1)}/${currentDate.getFullYear()} `
  }, []);

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('es-ES', {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  return (
    <>
      {user?.isTerms ? (
        <section className={style.payment}>
          <div className={style.payment__container}>
            <div className={style.payment__card}>
              <Cards
                number="5466359723151547"
                name="Easy Online English"
                expiry={getCurrentDate()}
                cvc={123}
              />
            </div>

            <form className={style.payment__form}>
              <header>
                <h1 className={style.payment__title}>{
                  user?.payment?.plan && PAYMENT_METHOD[Number(user?.payment?.plan)].DESCRIPTION ||
                  paymentTitle
                }</h1>
              </header>

              {!user?.payment?.isPayment && (
                <div className={style.payment__inputs}>
                  <PayPalSubcription
                    onComplete={onCompletedPayment}
                    plan={paymentMethod}
                  />
                </div>
              )}

              {user?.payment?.isPayment && user?.payment?.status === 'ACTIVE' && (
                <div className={style.payment__subscription}>
                  <p>
                    Tu pago recurrente ha comenzado
                    <strong> {formatDate(user.payment.dateStart)}</strong> y se renovará automáticamente hasta el
                    <strong> {formatDate(user.payment.dateEnd)}</strong>.
                  </p>
                  <CancelSubscription
                    onCancelled={() => {
                      // Actualizar estado del usuario o recargar datos
                      window.location.reload();
                    }}
                    onError={(message) => {
                      console.error('Error al cancelar:', message);
                      alert(message); // Mostrar mensaje de error al usuario
                    }}
                  />
                </div>
              )}
            </form>
          </div>
          <SuccessPayment
            modalState={[canOpenModal, setCanOpenModal]}
          />
        </section>
      ) : <AllTerms />}
    </>
  );
};

export default PaymentForms;
