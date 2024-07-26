import React, { useContext, useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { studentPayment, studentPendingPayment, homepage, admin } from './data';
import { Tab } from './type';
import context from '../../global/state/context';
import { isAdmin, isFree } from '../../tools/function';
import Image from '../Image';
import style from './style.module.sass'

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
    } else if (isAdmin(user)) {
      tab = admin;
    } else if (user.payment.isPayment || isFree(user)) {
      tab = studentPayment;
    } else {
      tab = studentPendingPayment;
    }
    setTabs(tab);
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // @ts-ignore
      if (!event.target.classList.contains(style.navigator__links) || !event.target.classList.contains(style.navigator__user)) {
        window.setTimeout(() => onOpenNavMobile(), 100);
      }
    };

    const removeEvent = () => document.removeEventListener('mousedown', handleClickOutside);

    canOpen
      ? document.addEventListener('mousedown', handleClickOutside)
      : removeEvent();

    return removeEvent;
  }, [canOpen]);

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

  const Tabs = (): JSX.Element[] =>
    tabs.map(({ path, value, showMobile }: Tab, index: number): JSX.Element => (
      <li
        className={`${style.navigator__tab} ${showMobile ? style.navigator__tabMobile : ''} `}
        key={index}
      >
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
        <div className={style.navigator__container}>
          <div className={style.navigator__logo}>
            <Link className={style.navigator__link} to={isAdmin(user) ? '/courses' : '/'}>
            <Image
              alt="logo"
              path="icons/logo-hUzihbdc6SVraJNSw22mWbQWhY8aF7.avif"
            />
            </Link>
          </div>
          <ul className={style.navigator__links}>
            <Tabs />
            {user && (
              <li>
                <Link to="/profile" className={style.navigator__user}>
                  <img
                    className={style.navigator__picture}
                    src={user.photo}
                  />
                  <span className={style.navigator__user_name}>
                    {`${user.name} ${user.lastname}`}
                  </span>
                </Link>
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
        </div>
      </nav>
    </>
  );
}

export default Navigator;