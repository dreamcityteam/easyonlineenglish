import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import style from './style.module.sass';
import { ASSETS_URL } from '../../tools/constant';

const Footer: React.FC = (): JSX.Element => {
  const creditCards: string[] = ['mastercard.png', 'paypal.png', 'visa.jpg'];
  const terms: string[][] = [
    ['Términos y condiciones', 'conditions'],
    ['Política de Privacidad', 'privacy'],
    ['Acuerdos', 'agreement'],
    ['Usuario final', 'user'],
    ['Compra del Producto', 'payment'],
    ['Servicio', 'service']
  ];
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <footer className={style.footer} {...isHomePage ? {
      style: {
        backgroundColor: '#f4f4f4'
      }
    } : {}}>
      {isHomePage && (
        <ul className={style.footer__items}>
          <li className={style.footer__address}>
            <strong>Dirección: </strong>
            Calle Dr. Alejo Martínez, Plaza Colonial, local comercial número 30, Sector El Batey, Sosúa, Puerto Plata, República Dominicana.
          </li>
          <li className={style.footer__term}>
            {terms.map(([name, link]) => (
              <span><Link to={`term-${link}`}>{name}</Link></span>
            ))}
          </li>
          <li className={style.footer__item}>
            {creditCards.map((creditCard: string): JSX.Element => (
              <img src={`${ASSETS_URL}2016/12/${creditCard}`} />
            ))}
          </li>
        </ul>
      )}
      <div className={style.footer__copyright}>
        <span >
          Copyright © {new Date().getFullYear()} Easy Online English
        </span>
      </div>

    </footer>
  )
};

export default Footer;
