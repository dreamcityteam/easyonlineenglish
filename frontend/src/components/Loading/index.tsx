import React from 'react';
import Modal from '../Modal';
import logoSVG from '../../../public/svg/icon.svg';

interface LoadingProps {
  text: string;
  canShow: boolean;
}

const Loading: React.FC<LoadingProps> = ({
  text = 'Loading...',
  canShow
}): JSX.Element => (
  <Modal canShow={canShow} backgroundColor='#ffffff'>
    <div>
      <div style={{ padding: '20px' }}>
        <img src={logoSVG} alt="logo" />
      </div>
      <div>
        <span>{text} ...</span>
      </div>
    </div>
  </Modal>
);

export default Loading;
