import React from 'react';
import { useLocation } from 'react-router-dom';
import style from './style.module.sass';
import { ASSETS_URL } from '../../tools/constant';

const Footer: React.FC = (): JSX.Element => {
  const creditCards: string[] = ['mastercard.png', 'paypal.png', 'visa.jpg', 'amex.png'];
  const location = useLocation();

  return (
    <footer className={style.footer}>
      {location.pathname === '/' && (
        <ul className={style.footer__items}>
          <li className={style.footer__address}>
            <strong>Dirección: </strong>
            Calle Dr. Alejo Martínez, Plaza Colonial, local comercial número 30, Sector El Batey, Sosúa, Puerto Plata, República Dominicana.
          </li>
          <li className={style.footer__item}>
            {creditCards.map((creditCard: string): JSX.Element => (
              <img src={`${ASSETS_URL}2016/12/${creditCard}`} />
            ))}
          </li>
        </ul>
      )}
      <span className={style.footer__title}>
        Copyright © {new Date().getFullYear()} Easy Online English
      </span>
    </footer>
  )
};

export default Footer;
