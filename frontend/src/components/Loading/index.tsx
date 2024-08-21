import React from 'react';
import Modal from '../Modal';
import Image from '../Image';

interface Props {
  text: string;
  state: [boolean, (state: boolean) => void];
}

const Loading: React.FC<Props> = ({
  text = 'Loading...',
  state
}): JSX.Element => (
  <Modal state={state} backgroundColor='#ffffff'>
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
