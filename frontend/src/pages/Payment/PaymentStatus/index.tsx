import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { send } from '../../../tools/function';
import Loading from '../../../components/Form/Loading';
import Modal from '../../../components/Modal';
import SVGSuccess from '../../../../public/svg/success.svg';
import SVGAlert from '../../../../public/svg/circleAlert.svg';
import Close from '../../../components/Modal/Close';
import style from './style.module.sass';

const PaymentStatus: React.FC = () => {
  const [canOpenModal, setCanOpenModal] = useState<boolean>(false);
  const [titlePayment, setTitlePayment] = useState<string>('');
  const [messagePayment, setMessagePayment] = useState<string>('');
  const [isApproved, setIsApproved] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { search } = useLocation();

  const query = useMemo(() => new URLSearchParams(search), [search]);
  const orderId = query.get('orderId');

  const confirmPaymentData = async (orderId: string) => {
    setIsLoading(true);

    send({ api: `/azul-payment-3ds-get-response-data?orderId=${orderId}` }).get()
      .then(({ response }: any) => {

        const { transactionResp, approved, statusMSG } = response.data.result;

        setIsApproved(approved);

        if (approved) {
          setTitlePayment('Pago procesado');
          setMessagePayment(
            'Su pago ha sido procesado exitosamente. Recibirás un correo electrónico con el recibo de tu pago en los próximos minutos.',
          );

          setIsLoading(false);
          setCanOpenModal(true);

          return;
        }
        setTitlePayment('Pago no procesado');
        setMessagePayment(statusMSG);
        setCanOpenModal(true);
      })
      .catch(() => {
        setTitlePayment('Pago no procesado');
        setMessagePayment(
          'Ha ocurrido un error inesperado al realizar el pago, favor ponerse en contacto con nosotros.',
        );
        setCanOpenModal(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (!orderId) {
      setTitlePayment('Pago no procesado');
      setMessagePayment('Pago no procesado');
      setCanOpenModal(true);
    } else {
      confirmPaymentData(orderId);
    }
  }, []);

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <Modal state={[canOpenModal, setCanOpenModal]}>
          <div className={style.payment__modal}>
            <Close onClose={() => setCanOpenModal(false)} />
            <header className={style.payment__modalIcon}>
              <img src={!isApproved ? SVGAlert : SVGSuccess} />
              <h2>{titlePayment}</h2>
            </header>
            <div className={style.payment__modalText}>
              <p>{messagePayment}</p>
            </div>
            {!isApproved ? (
              <></>
            ) : (
              <Link to="/courses" className={style.payment__modalButton}>
                Comenzar los cursos
              </Link>
            )}
          </div>
        </Modal>
      )}
    </>
  );
};

export default PaymentStatus;