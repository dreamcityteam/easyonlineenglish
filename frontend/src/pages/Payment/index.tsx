import React, { useContext, useState } from 'react';
import Cards from 'react-credit-cards-2';
import 'react-credit-cards-2/dist/es/styles-compiled.css';
import style from './style.module.sass';
import context from '../../global/state/context';
import { useParams } from 'react-router-dom';
import { send } from '../../tools/function';

const PaymentForms: React.FC = () => {
  const { paymentMethod } = useParams<string>();
  const [{ user }, dispatch] = useContext(context);
  const [state, setState] = useState({
    number: '',
    name: '',
    expiry: '',
    cvc: '',
    focus: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setState({
      ...state,
      [e.target.name]: e.target.value
    });
  };

  const handleFocusChange = (e: React.FocusEvent<HTMLInputElement>): void => {
    setState({
      ...state,
      focus: e.target.name
    });
  };

  const processPayment = async (): Promise<void> => {
    console.log('paymentMethod', paymentMethod);
    console.log('user', user);
    console.log(JSON.stringify(state));
    const response = await send({ api: '', data: {} }).post();
  };

  return (
    <div className={style.payment}>
      <div className={style.payment__container}>
        <Cards
          number={state.number}
          name={state.name}
          expiry={state.expiry}
          cvc={state.cvc}
        />
        <form className={style.payment__form}>
          <div className={style.payment__inputs}>
            <div className={style.payment__inputs_container}>
              <input
                type="text"
                name="number"
                onChange={handleInputChange}
                onFocus={handleFocusChange}
                placeholder="Número de la tarjeta"
                className={style.payment__input}
                value={state.number}
              />
            </div>
          </div>
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
            </div>
          </div>
          <div className={style.payment__inputs}>
            <div className={style.payment__inputs_container}>
              <input
                type="text"
                name="expiry"
                maxLength={4}
                onChange={handleInputChange}
                onFocus={handleFocusChange}
                placeholder="Fecha de expiración"
                className={style.payment__input}
                value={state.expiry}
              />
            </div>
            <div>
              <input
                type="text"
                name="cvc"
                maxLength={4}
                onChange={handleInputChange}
                onFocus={handleFocusChange}
                placeholder="CVC"
                value={state.cvc}
                className={style.payment__input}
              />
            </div>
          </div>
          <button
            onClick={processPayment}
            type="button"
            className={style.payment__input_button}
          >
            Pagar
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentForms;
