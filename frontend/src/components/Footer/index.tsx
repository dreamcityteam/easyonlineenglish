import React, { useContext, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import context from '../../global/state/context';
import { creditCards, terms } from './data';
import { NamePath } from './type';
import Image from '../Image';
import style from './style.module.sass';
import { isAdmin } from '../../tools/function';

const Footer: React.FC = (): JSX.Element => {
  const [{ user }] = useContext(context);
  const { pathname } = useLocation();
  const canShowInfo: boolean = useMemo(() => (
    pathname.includes('term') ||
    pathname.includes('payment') ||
    (pathname === '/' && !isAdmin(user))
  ), [pathname]);

  return (
    <footer className={style.footer}>
      {canShowInfo ? (
        <ul className={style.footer__items}>
          <li className={style.footer__address}>
            <strong>Dirección: </strong>
            <div>
              <span>Cabarete, Puerto Plata, República Dominicana.</span>
            </div>
          </li>

          <li className={style.footer__term}>
            {terms.map(({ name, path }: NamePath, index: number): JSX.Element => (
              <span key={index}>
                <Link to={`term-${path}`}>{name}</Link>
              </span>
            ))}
          </li>

          <li className={style.footer__item}>
            {creditCards.map(({ name, path }: NamePath, index: number): JSX.Element => (
              <Image
                alt={`${name} icon`}
                key={index}
                path={path}
              />
            ))}
          </li>
        </ul>
      ) : null}

      <div className={style.footer__copyright}>
        <span >
          Copyright © {new Date().getFullYear()} Easy Online English
        </span>
      </div>
    </footer>
  );
};

export default Footer;
