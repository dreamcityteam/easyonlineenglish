import React, { useContext, useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { studentPayment, studentPendingPayment, homepage } from './data';
import { Tab } from './type';
import style from './style.module.sass'
import context from '../../global/state/context';
import SVGLogo from '../../../public/svg/logo.svg';

const Navigator: React.FC = (): JSX.Element => {
  const [{ user }] = useContext(context);
  const [canOpen, setCanOpen] = useState<boolean>(false);
  const nav: React.MutableRefObject<null> = useRef<null>(null);
  const [tabs, setTabs] = useState<Tab[]>([]);
  const location = useLocation();

  useEffect(() => {
    let tab: Tab[] = [];

    if (user === null) {
      tab = homepage;
    } else if (user.isPayment) {
      tab = studentPayment;
    } else {
      tab = studentPendingPayment;
    }

    setTabs(tab);
  }, [user]);

  const onOpenNavMobile = (): void => {
    const newState: boolean = !canOpen;

    if (nav.current) {
      //@ts-ignore
      nav.current.classList.toggle(style.navigator__open, newState);
    }

    setCanOpen(newState);
  }

  const getTargetClassName = (path: string): string => (
    location.pathname === path || 
    (path === '/courses') && location.pathname.includes('course') ||
    (path === '/plan') && location.pathname.includes('payment') 
      ? style.navigator__target
      : ''
  );

  const Links = (): JSX.Element[] =>
    tabs.map(({ path, value }: Tab, index: number): JSX.Element => (
      <li key={index} className={style.navigator__link_container}>
        <Link
          className={`${style.navigator__link} ${getTargetClassName(path)}`}
          to={path}
        >
          {value}
        </Link>
      </li>
    ));

  return (
    <>
      <nav className={style.navigator} ref={nav}>
        <div className={style.navigator__logo}>
          <Link className={style.navigator__link} to="/">
            <img src={SVGLogo} alt="logo" />
          </Link>
        </div>
        <ul className={style.navigator__links}>
          <Links />
          {user && (
            <li className={style.navigator__user}>
              <img
                className={style.navigator__picture}
                src={user.photo}
              />
              <span className={style.navigator__user_name}>
                {`${user.name} ${user.lastname}`}
              </span>
            </li>
          )}
        </ul>
        <div
          className={style.navigator__hamburger}
          onClick={onOpenNavMobile}
        >
          <div className={style.navigator__line}></div>
          <div className={style.navigator__line}></div>
          <div className={style.navigator__line}></div>
        </div>
      </nav>
    </>
  );
}

export default Navigator;
