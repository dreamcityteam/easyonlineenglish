import React, { useContext, useEffect, useState } from 'react';
import Cards from 'react-credit-cards-2';
import 'react-credit-cards-2/dist/es/styles-compiled.css';
import style from './style.module.sass';
import context from '../../global/state/context';
import { useNavigate, useParams } from 'react-router-dom';
import { send } from '../../tools/function';
import { SET_USER } from '../../global/state/actionTypes';
import Loading from '../../components/Form/Loading';
import { HTTP_STATUS_CODES } from '../../tools/constant';

const PaymentForms: React.FC = () => {
  const redirect = useNavigate();
  const { paymentMethod } = useParams<string>();
  const [paymentTitle, setPaymentTitle] = useState<string>();
  const [{ user }, dispatch] = useContext(context);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [state, setState] = useState<any>({
    number: { value: '', messageError: '' },
    name: { value: '', messageError: '' },
    expiry: { value: '', messageError: '' },
    cvc: { value: '', messageError: '' },
    focus: { value: '', messageError: '' },
  });

  useEffect(() => {
    if (paymentMethod === '1') setPaymentTitle('MEMBRESÍA POR 1 MES');
    else if (paymentMethod === '2') setPaymentTitle('MEMBRESÍA POR 1 AÑO');
    else if (paymentMethod === '3') setPaymentTitle('MEMBRESÍA POR 3 MES');
    else redirect('/plan');
  }, []);

  const isEmptyField = (): boolean => {
    let isEmpty: boolean = false;

    Object.keys(state).forEach(key => {
      const field = state[key];

      const messageError: string = field && !field.value && key !== 'focus' ? 'Por favor, complete este campo.' : '';

      if (messageError) {
        isEmpty = true
      }

      setState((state: any) => ({ ...state, [key]: { ...state[key], messageError } }));
    });

    return isEmpty;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setState({
      ...state,
      [e.target.name]: { ...state[e.target.name], value: e.target.value }
    });
  };

  const handleFocusChange = (e: React.FocusEvent<HTMLInputElement>): void => {
    setState({
      ...state,
      focus: { ...state[e.target.name], value: e.target.value }
    });
  };

  const processPayment = async (): Promise<void> => {
    if (isEmptyField()) return;

    setIsLoading(true);

    let field = { key: '', messageError: '' }
    const { response: { data = {}, statusCode } }: any = await send({
      api: 'azul-payment', data: {
        plan: paymentMethod,
        csv: state.cvc.value,
        expiration: state.expiry.value,
        number: state.number.value,
        name: state.name.value
      }
    }).post();
 
    if (statusCode === HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR) {
      field.messageError = 'Error al intentar hacer la transacción, inténtalo más tarde.';
      field.key = 'expiry';
    } else if (statusCode === HTTP_STATUS_CODES.OK) {
      redirect('/courses');
      dispatch({ type: SET_USER, payload: { ...user, isPayment: true } });
    } else if (data.IsoCode === '99') {
      field.messageError = 'Número de tarjeta inválido.';
      field.key = 'number';
    } else if (data.ErrorDescription === 'VALIDATION_ERROR:Expiration') {
      field.messageError = 'Fecha de expiración inválida.';
      field.key = 'expiry';
    }

    if (field.messageError) {
      setState((state: any) => ({
        ...state,
        [field.key]: {
          ...state[field.key],
          messageError: field.messageError
        }
      }));
    }

    setIsLoading(false);
  };

  const getErrorMessage = (field: { value: string; messageError: string; }): JSX.Element => (
    <span className={style.payment__errorMessage}>{field && field.messageError}</span>
  );

  return (
    <section className={style.payment}>
      <header>
        <h1 className={style.payment__title}>{paymentTitle}</h1>
      </header>
      <div className={style.payment__container}>
        <Cards
          number={state.number.value}
          name={state.name.value}
          expiry={state.expiry.value}
          cvc={state.cvc.value}
        />
        <form className={style.payment__form}>
          <div className={style.payment__inputs}>
            <div className={style.payment__inputs_container}>
              <input
                type="text"
                name="name"
                maxLength={30}
                onChange={handleInputChange}
                onFocus={handleFocusChange}
                placeholder="Nombre"
                className={style.payment__input}
              />
              {getErrorMessage(state.name)}
            </div>
          </div>
          <div className={style.payment__inputs}>
            <div className={style.payment__inputs_container}>
              <input
                type="text"
                name="number"
                onChange={handleInputChange}
                onFocus={handleFocusChange}
                placeholder="Número de la tarjeta"
                className={style.payment__input}
              />
              {getErrorMessage(state.number)}
            </div>
          </div>
          <div className={style.payment__inputs}>
            <div className={style.payment__inputs_container}>
              <input
                type="text"
                name="expiry"
                maxLength={6}
                onChange={handleInputChange}
                onFocus={handleFocusChange}
                placeholder="Fecha de expiración"
                className={style.payment__input}
              />
              {getErrorMessage(state.expiry)}
            </div>
            <div>
              <input
                type="text"
                name="cvc"
                maxLength={4}
                onChange={handleInputChange}
                onFocus={handleFocusChange}
                placeholder="CVC"
                className={style.payment__input}
              />
              {getErrorMessage(state.cvc)}
            </div>
          </div>
          <div className={style.payment__input_button}>
            {isLoading ? <Loading /> : (
              <button
                onClick={processPayment}
                type="button"
                className={style.payment__input_button}
              >
                Pagar
              </button>
            )}
          </div>
        </form>
      </div>
    </section>
  );
};

export default PaymentForms;
