import React, { useMemo, useRef, useState } from 'react';
import style from './style.module.sass';
import Speech from '../../../../components/Speech';
import pronunciation from './pronunciation.json';
import Sound from '../../../../components/Sound';
import { Sentence, Word } from '../../../../global/state/type';
import { getFeedbackMessage } from '../../../../tools/function';
import { songTimings } from './data';

interface Prop {
  feedback: { canShow: boolean; message: string; };
  onNext: () => void;
  onPlaySpeech: (canPlay: boolean) => void;
  sentenceIndex: number;
  word: Word;
};

interface TOnSpeach {
  index: number;
  onPlay: () => void;
  englishWord: string;
  audioUrl: string;
};

const AlphabetPage: React.FC<Prop> = ({
  word,
  sentenceIndex,
  onNext,
  onPlaySpeech,
}) => {
  const refButtonAudio = useRef(null);
  const [displayedLetters, setDisplayedLetters] = useState<{ [key: string]: boolean; }>({});
  const displayedLettersLen: number = useMemo(() => Object.keys(displayedLetters).length, [displayedLetters]);
  const [currentLetter, setCurrentLetter] = useState<{ audioUrl: string; word: string } | null>(null);
  const [canReapet, setCanReapet] = useState(true);
  const [feedback, setFeedback] = useState({
    isCorrect: false,
    canShow: false,
    message: ''
  });

  const onCheck = (isCorrect: boolean, englishWord: string): void => {
    const currentSentece: Sentence = word.sentences[sentenceIndex];
    const isWord: boolean = isCorrect && (englishWord === currentSentece.englishWord);

    if (isWord) {
      onNext();
      setFeedback({
        isCorrect,
        canShow: true,
        message: getFeedbackMessage().correct
      })
    } else {
      setFeedback({
        isCorrect,
        canShow: true,
        message: getFeedbackMessage().wrong
      });
    }
  }

  const onCurrentTime = (time: number) => {
    const delta = 0.05;
    const letterTimings: [number, string][] = songTimings[word.englishWord.toLowerCase()];

    // Clear condition
    if (Math.abs(time - 17.8) <= delta || Math.abs(time - 24.1) <= delta) {
      setDisplayedLetters({});
    }

    // Loop through and display letters at matching times
    for (const [target, letter] of letterTimings) {
      if (Math.abs(time - target) <= delta && !displayedLetters[letter]) {
        setDisplayedLetters((current) => ({ ...current, [letter]: true }));
      }
    }
  };

  const onMusic = (canPlay: boolean) => {
    setCurrentLetter(null);

    if (canPlay) {
      setDisplayedLetters({});
    }
  }

  const onStopMusic = () => {
    // @ts-ignore
    if (refButtonAudio.current.dataset.reapet === 'true') {
      setCanReapet(false);

      // @ts-ignore
      refButtonAudio.current?.click();
    } else {
      setCanReapet(true);
    }
  }

  const onSpeach = ({ index, onPlay, englishWord, audioUrl }: TOnSpeach) => {
    if (sentenceIndex < index) return;
    onPlay();
    // @ts-ignore
    displayedLettersLen && refButtonAudio.current?.click();
    setCurrentLetter({ word: englishWord, audioUrl: audioUrl });
    setCanReapet(true);
  }

  return (
    <div className={`${style['alphabet-page']}`}>
      <p>Canta la canción</p>
      <Sound
        src={word.musicUrl}
        style={{}}
        onCurrentTime={onCurrentTime}
        onStop={onStopMusic}
        render={(canPlay = false) => (
          <img
            onClick={() => onMusic(canPlay)}
            ref={refButtonAudio}
            data-reapet={canReapet}
            className={style['song-button']}
            src={`https://abaw33hy9bfvxqdq.public.blob.vercel-storage.com/icons/${canPlay ? 'pausa-CdNhAEsQLGS76ysd8YFV9VOClFnOuj' : 'audio-CeDJSLKXnC4lwR0t1XYzlSlu09w0Em'}.${canPlay ? 'png' : 'jpg'}`}
          />
        )}
      />
      <p>Haz clic en cada letra para escuchar la pronunciación y repetir después del beep.</p>

      {feedback.canShow && (
        <p
          className={style.feedback}
          style={{ background: feedback.isCorrect ? 'green' : 'red', color: 'white' }}>
          {feedback.message}
        </p>
      )}

      <div className={style['letter-grid']}>
        {word.sentences.map(({ englishWord, audioUrl }, index) => {
          const classNameAnimation: string = (
            currentLetter?.word === englishWord || displayedLettersLen === index + 1
          ) ? `${style.beat} ${style['letter-animation']}` : '';

          return (
            <Speech
              audioUrl={audioUrl}
              canNext={pronunciation}
              canShowMessage={false}
              interimResults
              key={index}
              onCheck={(isCorrect: boolean) => onCheck(isCorrect, englishWord)}
              onPlaySpeech={onPlaySpeech}
              word={englishWord}
              custom={({ onPlay }) => (
                <div
                  key={index}
                  className={`${style.letter} ${classNameAnimation}`}
                  style={{ filter: sentenceIndex < index ? 'grayscale(100%)' : '' }}
                  onClick={() => onSpeach({ index, onPlay, englishWord, audioUrl })}
                > {englishWord} </div>
              )
              }
            />
          )
        })}
      </div>
    </div>
  );
};

export default AlphabetPage;
