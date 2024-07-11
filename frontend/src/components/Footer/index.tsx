import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import style from './style.module.sass';
import { ROLE } from '../../tools/constant';
import context from '../../global/state/context';
import { getPath } from '../../tools/function';

const Footer: React.FC = (): JSX.Element => {
  const [{ user }] = useContext(context);
  const creditCards: string[] = ['mastercard.png', 'paypal.png', 'visa.jpg'];
  const terms: string[][] = [
    ['Términos y condiciones', 'conditions'],
    ['Política de Privacidad', 'privacy'],
    ['Acuerdo de Licencia de Usuario Final Global', 'user'],
    ['Compra del Producto', 'payment'],
  ];
  const location = useLocation();
  const isHomePage: boolean = location.pathname === '/' && user?.role !== ROLE.ADMIN;

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
            {terms.map(([name, link], index: number): JSX.Element => (
              <span key={index}><Link to={`term-${link}`}>{name}</Link></span>
            ))}
          </li>
          <li className={style.footer__item}>
            {creditCards.map((creditCard: string, index: number): JSX.Element => (
              <img key={index} src={getPath(`2016/12/${creditCard}`)} />
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
