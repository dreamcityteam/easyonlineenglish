import React from 'react';
import Modal from '../Modal';
import Image from '../Image';

interface Props {
  text: string;
  canShow: boolean;
}

const Loading: React.FC<Props> = ({
  text = 'Loading...',
  canShow
}): JSX.Element => (
  <Modal canShow={canShow} backgroundColor='#ffffff'>
    <div>
      <div style={{ padding: '20px' }}>
        <Image
          path="icons/logo-loading-P5BjK5Qki2eDup3kG9XVBlTMXaRkyi.avif"
          alt="Icon logo loading"
        />
      </div>
      <div>
        <span style={{ fontWeight: 'bold' }}>
          {text} ...
        </span>
      </div>
    </div>
  </Modal>
);

export default Loading;
