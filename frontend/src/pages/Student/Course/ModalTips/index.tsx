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
    <Modal state={[canShow, setCanShow]}>
      <div className={style.loading}>
        <div className={style.loading__container}>
          <Close onClose={() => setCanShow(false)} />
          <div className={style.loading__image}>
            <Image
              path="logo-loading-klQAUtgmmO98yTboO81AuSKCMrni6c.jpg"
              alt="Icon logo loading"
            />
          </div>
          <div>
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
