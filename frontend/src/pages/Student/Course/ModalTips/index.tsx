import React, { useEffect, useMemo, useState } from 'react';
import Modal from '../../../../components/Modal';
import Image from '../../../../components/Image';
import { data } from './data';
import { Data } from './type';
import style from './style.module.sass';
import Close from '../../../../components/Modal/Close';

const ModalTips: React.FC = () => {
  const [canShow, setCanShow] = useState<boolean>(true);
  const { title, text }: Data = useMemo(() => (
    data[Math.floor(Math.random() * data.length)]
  ), []);

  return (
    <Modal canShow={canShow}>
      <div className={style.loading}>
        <div className={style.loading__container}>
          <div className={style.loading__image}>
            <Image
              path="icons/logo-loading-P5BjK5Qki2eDup3kG9XVBlTMXaRkyi.avif"
              alt="Icon logo loading"
            />
          </div>
          <div>
            <Close onClose={() => setCanShow(false)} />
            <header className={style.loading__header}>
              <h2>"{title}"</h2>
              <p>{text}</p>
            </header>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ModalTips;
