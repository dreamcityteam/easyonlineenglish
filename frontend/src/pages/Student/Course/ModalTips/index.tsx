import React, { useEffect, useMemo, useState } from 'react';
import Modal from '../../../../components/Modal';
import Image from '../../../../components/Image';
import { data, data2 } from './data';
import { Data } from './type';
import style from './style.module.sass';
import Close from '../../../../components/Modal/Close';
import Sound from '../../../../components/Sound';

const ModalTips: React.FC = () => {
  const [canShow, setCanShow] = useState<boolean>(true);
  const { es, en, audio }: any = useMemo(() => (
    data2[Math.floor(Math.random() * data2.length)]
  ), []);

  return (
    <Modal state={[canShow, setCanShow]}>
      <div className={style.tips}>
        <div className={style.tips__container}>
          <div className={style.tips__image}>
            <Image
              path="logo-loading-klQAUtgmmO98yTboO81AuSKCMrni6c.jpg"
              alt="Icon logo loading"
            />
          </div>
          <div>
            <header className={style.tips__header}>
              <h2>"{en}"</h2>
              <p>{es}</p>
            </header>
            <Sound src={audio} style={style} />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ModalTips;
