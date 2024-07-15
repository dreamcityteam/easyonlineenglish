import React, { useContext, useEffect, useState } from 'react';
import Cards from 'react-credit-cards-2';
import 'react-credit-cards-2/dist/es/styles-compiled.css';
import style from './style.module.sass';
import context from '../../global/state/context';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { send } from '../../tools/function';
import { SET_USER } from '../../global/state/actionTypes';
import Loading from '../../components/Form/Loading';
import { HTTP_STATUS_CODES } from '../../tools/constant';
import { Field } from './type';
import Modal from '../../components/Modal';
import SVGSuccess from '../../../public/svg/success.svg';
import Close from '../../components/Modal/Close';
import PayPal from './PayPal';
import AllTerms from '../Terms/All';

const PaymentForms: React.FC = () => {
  const { paymentMethod } = useParams<string>();
  const [canOpenModal, setCanOpenModal] = useState<boolean>(false);
  const [paymentTitle, setPaymentTitle] = useState<string>();
  const [{ user, googleAnalytics }, dispatch] = useContext(context);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const redirect = useNavigate();
  const [state, setState] = useState<any>({
    number: { value: '', messageError: '' },
    name: { value: '', messageError: '' },
    expiry: { value: '', messageError: '' },
    cvc: { value: '', messageError: '' },
    focus: { value: '', messageError: '' },
  });
  const [treeDSecureForm, setTreeDSecureForm] = useState<string>('');

  useEffect(() => {
    if (paymentMethod === '1') setPaymentTitle('MEMBRESÍA POR 1 MES');
    else if (paymentMethod === '2')
      setPaymentTitle('MEMBRESÍA POR 1 AÑO');
    else if (paymentMethod === '3')
      setPaymentTitle('MEMBRESÍA POR 3 MES');
    else redirect('/plan');
  }, []);

  const isEmptyField = (): boolean => {
    let isEmpty: boolean = false;

    Object.keys(state).forEach((key) => {
      const field = state[key];

      const messageError: string =
        field && !field.value && key !== 'focus'
          ? 'Complete este campo.'
          : '';

      if (messageError) {
        isEmpty = true;
      }

      setState((state: any) => ({
        ...state,
        [key]: { ...state[key], messageError },
      }));
    });

    return isEmpty;
  };

  const handleInputChange = ({
    target: { name, value },
  }: any): void => {
    let newValue: string = value;

    if (name === 'number') {
      newValue = getNumber(value);
    } else if (name === 'expiry') {
      newValue = getNumber(value);
    }

    setState({
      ...state,
      [name]: { ...state[name], value: newValue },
    });
  };

  const handleFocusChange = ({
    target: { name, value },
  }: any): void => {
    setState({ ...state, focus: { ...state[name], value } });
  };

  const processPayment = async (): Promise<void> => {
    const EXPIRY_PREFIX = '20';

    if (isEmptyField()) return;

    setIsLoading(true);

    const {
      response: { data = {}, statusCode },
    }: any = await send({
      api: 'azul-payment',
      data: {
        plan: paymentMethod,
        csv: state.cvc.value,
        expiration: `${EXPIRY_PREFIX}${state.expiry.value}`,
        number: state.number.value,
        name: state.name.value,
      },
    }).post();


    setTreeDSecureForm(data.form || '')

    if (statusCode === HTTP_STATUS_CODES.OK) {
      setCanOpenModal(true);
      dispatch({
        type: SET_USER,
        payload: {
          ...user,
          payment: { isPayment: true, plan: paymentMethod },
        },
      });
      googleAnalytics('event', `payment_${paymentMethod}`, {
        'event_category': 'payment',
        'event_label': 'Pago'
      });
    } else if (data.message) {
      setState((state: any) => ({
        ...state,
        [data.field]: {
          ...state[data.field],
          messageError: data.message,
        },
      }));
    }

    setIsLoading(false);
  };

  const getErrorMessage = (field: Field): JSX.Element => (
    <span className={style.payment__errorMessage}>
      {field && field.messageError}
    </span>
  );

  const formatInput = (
    type: 'number' | 'expiry',
    value: string
  ): string => {
    const format = {
      number: { regExp: /.{1,4}/g, sing: ' ' },
      expiry: { regExp: /.{1,2}/g, sing: '/' },
    };
    const cleaned = value.replace(/\D/g, '');
    const groups = cleaned.match(format[type].regExp);

    return groups ? groups.join(format[type].sing) : value;
  };

  const getNumber = (value: string): string =>
    value.replace(/\D/g, '');

  const handleKeyPress = (event: any) => {
    if (event.key === 'Enter') {
      processPayment();
    }
  };

  const onCompletePayPal = () => {
    setCanOpenModal(true);
    dispatch({
      type: SET_USER,
      payload: {
        ...user,
        payment: { isPayment: true, plan: paymentMethod },
      },
    });
  }

  return (
    <>
      {user?.isTerms ? (
        <section className={style.payment}>
          <div className={style.payment__container}>
            <div className={style.payment__card}>
              <Cards
                number={state.number.value}
                name={state.name.value}
                expiry={state.expiry.value}
                cvc={state.cvc.value}
              />
            </div>

            <form className={style.payment__form}>
              <header>
                <h1 className={style.payment__title}>{paymentTitle}</h1>
              </header>
 {/*
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
                    value={state.name.value}
                    onKeyDown={handleKeyPress}
                  />
                  {getErrorMessage(state.name)}
                </div>
              </div>
              <div className={style.payment__inputs}>
                <div className={style.payment__inputs_container}>
                  <input
                    type="text"
                    name="number"
                    maxLength={19}
                    onChange={handleInputChange}
                    onFocus={handleFocusChange}
                    placeholder="Número de la tarjeta"
                    className={style.payment__input}
                    value={formatInput('number', state.number.value)}
                    onKeyDown={handleKeyPress}
                  />
                  {getErrorMessage(state.number)}
                </div>
              </div>
              <div className={style.payment__inputs}>
                <div className={style.payment__inputs_container}>
                  <input
                    type="text"
                    name="expiry"
                    maxLength={5}
                    onChange={handleInputChange}
                    onFocus={handleFocusChange}
                    placeholder="Fecha de expiración"
                    className={style.payment__input}
                    value={formatInput('expiry', state.expiry.value)}
                    onKeyDown={handleKeyPress}
                  />
                  {getErrorMessage(state.expiry)}
                </div>
                <div>
                  <input
                    type="text"
                    name="cvc"
                    maxLength={3}
                    onChange={handleInputChange}
                    onFocus={handleFocusChange}
                    placeholder="CVC"
                    className={style.payment__input}
                    value={state.cvc.value}
                    onKeyDown={handleKeyPress}
                  />
                  <div className={style.payment__cvc}>
                    {getErrorMessage(state.cvc)}
                  </div>
                </div>
              </div>
              <div className={style.payment__input_button}>
                {isLoading ? (
                  <Loading />
                ) : (
                  <button
                    onClick={processPayment}
                    type="button"
                    className={style.payment__input_button}
                  >
                    Pagar
                  </button>
                )}
              </div>
                           */}
              <PayPal
                onComplete={onCompletePayPal}
                plan={paymentMethod || ''}
              />
            </form>
          </div>
          <Modal canShow={canOpenModal}>
            <div className={style.payment__modal}>
              <Close onClose={() => setCanOpenModal(false)} />
              <header className={style.payment__modalIcon}>
                <img src={SVGSuccess} />
                <h2>éxito</h2>
              </header>
              <div className={style.payment__modalText}>
                <p>
                  Tu pago ha sido procesado correctamente. Hemos enviado
                  una factura a tu correo electrónico.
                </p>
              </div>
              <Link to="/courses" className={style.payment__modalButton}>
                Comenzar los cursos
              </Link>
            </div>
          </Modal>
          <div dangerouslySetInnerHTML={{ __html: treeDSecureForm }} />

        </section>
      ) : <AllTerms />}
    </>
  );
};

export default PaymentForms;
