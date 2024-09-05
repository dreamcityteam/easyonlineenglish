import React, { useContext, useState } from 'react';
import style from './style.module.sass';
import Aside from '../../../components/Aside';
import { conversiations } from './data';
import Sound from '../../../components/Sound';
import Speech from '../../../components/Speech';
import Image from '../../../components/Image';

const Conversation: React.FC = (): JSX.Element => {
  const [data, setData] = useState<any>(conversiations);
  const [content, setContent] = useState<any[]>([]);
  const [tabIndex, setTabIndex] = useState<number>(0);
  const [speech, setSpeech] = useState<{
    [key: string]: {
      isCorrect: boolean;
      canShow: boolean;
    };
  }>({});

  const onCheck = (isCorrect: boolean, englishWord: string): void => {
    setSpeech((currentState) => ({
      ...currentState,
      [englishWord]: { isCorrect, canShow: true }
    }));
  }

  const handlerOnTab = (index: number): void => {
    setTabIndex(index);
  }

  const Feedback = (englishWord: string): JSX.Element => (
    <>
      {typeof speech[englishWord] !== 'undefined' && speech[englishWord].canShow && (
        <div
          className={style.conversation__feedback}
        >
          <Image
            alt="Feedback icon"
            path={speech[englishWord].isCorrect
              ? 'icons/file%20(2)-rUytCHTrOOkY1XVHaQluxJV3jc8ewm.png'
              : 'icons/file%20(1)%20(1)-8wtGfDcRc7aApX2SS1WrAYNhWBfTHl.png'}
          />
        </div>
      )}
    </>
  );

  const Dialogue = ({
    speaker,
    text,
    audioUrl,
  }: {
    speaker: string;
    text: string;
    audioUrl: string;
  }) => (
    <div className={style.conversation__dialogue}>
      <Sound
        src={audioUrl}
        style={style}
        render={() => (
          <p>
            {Feedback(text)}
            <strong>{speaker}:</strong> {text}
          </p>
        )}
      />
      <Speech
        audioUrl={audioUrl}
        onCheck={(isCorrect: boolean) => onCheck(isCorrect, text)}
        word={text}
        canShowMessage={false}
      />
    </div>
  );

  return (
    <section className={style.conversation}>
      <Aside onClick={handlerOnTab} data={data} tabIndex={tabIndex} />

      <div className={style.conversation__content}>
        <div>
          <h1>¿Dónde vivo?</h1>
          <h2>Dialogue 1:</h2>
          <Dialogue
            speaker="Anna"
            text="Where do you live?"
            audioUrl="https://coachingresourcecenter.com/wp-content/uploads/easyonlineenglish/2024/07/Where-do-you-live.mp3"
          />
          <Dialogue
            speaker="Ben"
            text="I live in a house in the city."
            audioUrl="https://coachingresourcecenter.com/wp-content/uploads/easyonlineenglish/2024/07/I-live-in-a-house-in-the-city.mp3"
          />
          <Dialogue
            speaker="Anna"
            text="Oh, I live in an apartment in the city too. It's very busy here."
            audioUrl="https://coachingresourcecenter.com/wp-content/uploads/easyonlineenglish/2024/07/Oh-I%20live%20in%20an%20apartment.mp3"
          />

          <hr />
          <h2>Dialogue 2:</h2>

          <Dialogue
            speaker="Lisa"
            text="Do you live near here?"
            audioUrl="https://coachingresourcecenter.com/wp-content/uploads/easyonlineenglish/2024/07/Do-you-live-near-here.mp3"
          />
          <Dialogue
            speaker="Tom"
            text="No, I live in the countryside."
            audioUrl="https://coachingresourcecenter.com/wp-content/uploads/easyonlineenglish/2024/07/No-I-live-in-the-countryside.mp3"
          />
          <Dialogue
            speaker="Lisa"
            text="That sounds nice. Is it quiet there?"
            audioUrl="https://coachingresourcecenter.com/wp-content/uploads/easyonlineenglish/2024/07/That-sounds-nice-is-it-quite.mp3"
          />
          <Dialogue
            speaker="Tom"
            text="Yes, it is very quiet."
            audioUrl="https://coachingresourcecenter.com/wp-content/uploads/easyonlineenglish/2024/07/Yes-it-is-very-quiet.mp3"
          />
        </div>
      </div>
    </section >
  );
};

export default Conversation;
