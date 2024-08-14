import React, { useEffect, useMemo, useState } from 'react';
import Modal from '../Modal';
import Image from '../Image';
import { data } from './data';
import { Data } from './type';
import style from './style.module.sass';

interface Props {
  canShow: boolean;
}

const Loading: React.FC<Props> = ({ canShow }) => {
  const [canShowLoading, setCanShowLoading] = useState<boolean>(false);
  const [interval, setInterval] = useState<NodeJS.Timeout>();
  const { title, text }: Data = useMemo(() => (
    data[Math.floor(Math.random() * data.length)]
  ), []);

  useEffect(() => {
    if (canShow) {
      setCanShowLoading(true);
      setInterval(
        setTimeout(() => {
          setCanShowLoading(false);
        }, 2000)
      );
    }

    return () => {
      clearInterval(interval);
    }
  }, [canShow]);

  return (
    <Modal
      canShow={canShowLoading}
      backgroundColor='#ffffff'
    >
      <div className={style.loading}>
        <div className={style.loading__image}>
          <Image
            path="icons/logo-hUzihbdc6SVraJNSw22mWbQWhY8aF7.avif"
            alt="Icon logo loading"
          />
        </div>
        <div>
          <header className={style.loading__header}>
            <h2>{title}</h2>
            <p>{text}</p>
          </header>
        </div>
      </div>
    </Modal>
  );
};

export default Loading;
