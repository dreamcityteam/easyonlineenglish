import React, { useState } from 'react';
import style from './style.module.sass';
import { send } from '../../../tools/function';
import { HTTP_STATUS_CODES, REGEXP } from '../../../tools/constant';
import Loading from '../../../components/Form/Loading';
import Image from '../../../components/Image';

const Section6: React.FC = (): JSX.Element => {
  const [email, setEmail] = useState('');
  const [subscribe, setSubscribe] = useState<any>({
    message: '',
    isSubscribe: false,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const hanlderOnSuscribete = async () => {
    if (!email) {
      setSubscribe({
        message: 'Por favor, complete este campo.',
        isSubscribe: false
      });
    } else if (REGEXP.EMAIL.test(email)) {
      setIsLoading(true);

      const { response: { statusCode } } = await send({ api: 'suscribete', data: { email } }).post();

      if (statusCode === HTTP_STATUS_CODES.OK) {
        setSubscribe({
          message: 'Enviado.',
          isSubscribe: true
        });
        setEmail('');
      } else {
        setSubscribe({
          message: 'Error, intente mas tarde.',
          isSubscribe: false
        });
      }

      setIsLoading(false);
    } else {
      setSubscribe({
        message: 'El correo es inválido.',
        isSubscribe: false
      });
    }
  }

  const onChange = ({ target: { value } }: any) => {
    setEmail(value);
  }


  return (
    <article className={style.home}>
      <div className={style.home__wrapper}>
        <div>
          <header>
            <h2>¡Mantente Informado!</h2>
            <p>
              Subscríbete a nuestro boletín de noticias y promociones.
              Descubre nuevos tips para aprender Inglés. ¡Es fácil y divertido!
            </p>
          </header>
          <form>
            <div>
              <input
                onChange={onChange}
                placeholder="Tu correo electrónico"
                type="email"
                value={email}
              />
              <span
                style={{ color: subscribe.isSubscribe ? '#4caf50' : '#f44336' }}
              >
                {subscribe.message}
              </span>
            </div>
            {isLoading ? (
              <Loading />
            ) : (
              <input
                onClick={hanlderOnSuscribete}
                type="button"
                value="Suscribirse"
              />
            )}
          </form>
        </div>
        <div>
          <Image
            alt="Email notification icon"
            path="icons/email-2-NOwmYZsjmCWwtVMn6E8oYUro4Wi7eJ.avif"
          />
          <Image
            alt="Email notification shadow icon"
            path="home/shadow-WFRhXonJVV6SR5Rx6bWQQPITHrFRBn.avif"
          />
        </div>
      </div>
    </article>
  );
}

export default Section6;
