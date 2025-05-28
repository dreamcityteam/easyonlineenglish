import React, { useContext, useEffect, useState } from 'react';
import Cards from 'react-credit-cards-2';
import 'react-credit-cards-2/dist/es/styles-compiled.css';
import style from './style.module.sass';
import context from '../../global/state/context';
import { useNavigate, useParams } from 'react-router-dom';
import { CLEAN_CACHE, SET_USER } from '../../global/state/actionTypes';
import Loading from '../../components/Form/Loading';
import { PAYMENT_METHOD } from '../../tools/constant';
import PayPal from './PayPal';
import AllTerms from '../Terms/All';
import SuccessPayment from './SuccessModal';

const PaymentForms: React.FC = () => {
  const { paymentMethod = '' } = useParams<string>();
  const [canOpenModal, setCanOpenModal] = useState<boolean>(false);
  const [paymentTitle, setPaymentTitle] = useState<string>();
  const [{ user }, dispatch] = useContext(context);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const redirect = useNavigate();

  const [state, setState] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: '',
    focus: '',
  });

  const [errors, setErrors] = useState({
    name: '',
    number: '',
    expiry: '',
    cvc: '',
  });

  useEffect(() => {
    if (['1', '2', '3'].includes(paymentMethod)) {
      setPaymentTitle(PAYMENT_METHOD[Number(paymentMethod)].DESCRIPTION);
    } else {
      redirect('/plan');
    }
  }, []);

  const validateInputs = (): boolean => {
    const newErrors: typeof errors = {
      name: '',
      number: '',
      expiry: '',
      cvc: '',
    };

    if (!/^[a-zA-Z\s]{3,}$/.test(state.name)) {
      newErrors.name = 'Nombre inválido';
    }

    if (!/^\d{13,19}$/.test(state.number)) {
      newErrors.number = 'Número inválido';
    }

    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(state.expiry)) {
      newErrors.expiry = 'Fecha inválida (MM/YY)';
    }

    if (!/^\d{3,4}$/.test(state.cvc)) {
      newErrors.cvc = 'CVC inválido';
    }

    setErrors(newErrors);
    return Object.values(newErrors).every((err) => err === '');
  };

  const handleInputChange = ({ target: { name, value } }: any): void => {
    setState((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const onCompletedPayment = (): void => {
    setCanOpenModal(true);
    dispatch({ type: CLEAN_CACHE });
    dispatch({
      type: SET_USER,
      payload: {
        ...user,
        payment: {
          isPayment: true,
          plan: paymentMethod
        },
      },
    });
  }

  const onSubmit = (): void => {
    if (validateInputs()) {
      onCompletedPayment();
    }
  }

  return (
    <>
      {user?.isTerms ? (
        <section className={style.payment}>
          <div className={style.payment__container}>
            <div className={style.payment__card}>
              <Cards
                number={state.number}
                name={state.name}
                expiry={state.expiry}
                cvc={state.cvc}
              />
            </div>

            <form className={style.payment__form}>
              <header>
                <h1 className={style.payment__title}>{paymentTitle}</h1>
              </header>

              <div className={style.payment__inputs}>
                <div className={style.payment__inputs_container}>
                  <input
                    name="name"
                    onChange={handleInputChange}
                    placeholder="Nombre"
                    className={style.payment__input}
                    type="text"
                    value={state.name}
                  />
                  {errors.name && <span className={style.payment__errorMessage}>{errors.name}</span>}
                </div>
              </div>

              <div className={style.payment__inputs}>
                <div className={style.payment__inputs_container}>
                  <input
                    name="number"
                    onChange={handleInputChange}
                    placeholder="Número de tarjeta"
                    className={style.payment__input}
                    type="text"
                    value={state.number}
                  />
                  {errors.number && <span className={style.payment__errorMessage}>{errors.number}</span>}
                </div>
              </div>

              <div className={style.payment__inputs}>
                <div className={style.payment__inputs_container}>
                  <input
                    className={style.payment__input}
                    name="expiry"
                    onChange={handleInputChange}
                    placeholder="Fecha de expiración (MM/YY)"
                    type="text"
                    value={state.expiry}
                  />
                  {errors.expiry && <span className={style.payment__errorMessage}>{errors.expiry}</span>}
                </div>
              </div>

              <div className={style.payment__inputs}>
                <div className={style.payment__inputs_container}>
                  <input
                    className={style.payment__input}
                    name="cvc"
                    onChange={handleInputChange}
                    placeholder="CVC"
                    type="text"
                    value={state.cvc}
                  />
                  {errors.cvc && <span className={style.payment__errorMessage}>{errors.cvc}</span>}
                </div>
              </div>

              <div className={style.payment__inputs}>
                <div className={style.payment__input_button}>
                  {isLoading ? (
                    <Loading />
                  ) : (
                    <button
                      type="button"
                      className={style.payment__input_button}
                      onClick={onSubmit}
                    >
                      Pagar
                    </button>
                  )}
                </div>
                <PayPal
                  onComplete={onCompletedPayment}
                  plan={paymentMethod}
                />
              </div>
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
