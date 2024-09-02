import React, { useMemo, useState } from 'react';
import Modal from '../../../../components/Modal';
import Image from '../../../../components/Image';
import { data } from './data';
import style from './style.module.sass';
import Speech from '../../../../components/Speech';
import { checkPronunciation } from '../../../../tools/function';

interface SpeechFeedbackState {
  canShow: boolean;
  canShowFeedback: boolean;
  pronunciation: string;
}

const initialState: SpeechFeedbackState = {
  canShow: true,
  canShowFeedback: false,
  pronunciation: '',
};

const onSpeechFeedback = (
  isCorrect: boolean,
  pronunciation: string,
  setState: React.Dispatch<React.SetStateAction<SpeechFeedbackState>>
): void => {
  setState({
    canShow: !isCorrect,
    canShowFeedback: !isCorrect,
    pronunciation,
  });
};

const ModalTips: React.FC = (): JSX.Element => {
  const [state, setState] = useState<SpeechFeedbackState>(initialState);
  const { spanishTranslation = '', englishWord = '', audioUrl = '' } = useMemo(() => data[Math.floor(Math.random() * data.length)], []);

  return (
    <Modal
      state={[state.canShow, (canShow) => setState({ ...state, canShow })]}
      isFadeIn
      isBackgroundClose 
    >
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
              <h2>"{checkPronunciation(englishWord, state.pronunciation, state.canShowFeedback)}"</h2>
              <p>{spanishTranslation}</p>
            </header>
            <div className={style.tips__speech}>
            <Speech
              audioUrl={audioUrl}
              onCheck={(isCorrect, pronunciation) => onSpeechFeedback(isCorrect, pronunciation, setState)}
              word={englishWord}
            />
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ModalTips;
