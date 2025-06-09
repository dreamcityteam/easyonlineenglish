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

const Exercise: React.FC<Prop> = ({
  word,
  sentenceIndex,
  onNext,
  onPlaySpeech,
}) => {
  const refButtonAudio = useRef(null);
  const [displayedLetters, setDisplayedLetters] = useState<{ [key: string]: boolean; }>({});
  const displayedLettersLen: number = useMemo(() => Object.keys(displayedLetters).length, [displayedLetters]);
  const [feedback, setFeedback] = useState({
    isCorrect: false,
    canShow: false,
    message: ''
  });

  const onCheck = (isCorrect: boolean, englishWord: string): void => {
    const currentSentence: Sentence = word.sentences[sentenceIndex];
    const isValidAnswer: boolean = (isCorrect && englishWord) === currentSentence.englishWord;

    setFeedback({
      isCorrect: isValidAnswer,
      canShow: true,
      message: getFeedbackMessage()[isValidAnswer ? 'correct' : 'wrong'],
    });

    if (isValidAnswer) {
      onNext();
    }
  };

  const onCurrentTime = (time: number): void => {
    const delta: number = 0.05;
    const timingSong = songTimings[word.englishWord.toLowerCase()];
    const letterTimings: [number, string][] = timingSong.timing;

    if (timingSong.timingEnd.some((timeEnd) => (Math.abs(time - timeEnd) <= delta))) {
      setDisplayedLetters({});
    }

    for (const [target, letter] of letterTimings) {
      if (Math.abs(time - target) <= delta && !displayedLetters[letter]) {
        setDisplayedLetters((current) => ({ ...current, [letter]: true }));
      }
    }
  };

  const onMusic = (canPlay: boolean) => {
    if (canPlay) {
      setDisplayedLetters({});
    }
  }

  const onSpeach = ({ index, onPlay }: TOnSpeach) => {
    if (sentenceIndex < index) return;
    onPlay();
    // @ts-ignore
    displayedLettersLen && refButtonAudio.current?.click();
  }

  return (
    <div className={`${style['alphabet-page']}`}>
      <p className={style.text}>Canta la canción</p>
      <Sound
        src={word.musicUrl}
        style={{}}
        onCurrentTime={onCurrentTime}
        render={(canPlay = false) => (
          <img
            onClick={() => onMusic(canPlay)}
            ref={refButtonAudio}
            className={style['song-button']}
            src={`https://abaw33hy9bfvxqdq.public.blob.vercel-storage.com/icons/${canPlay ? 'pausa-CdNhAEsQLGS76ysd8YFV9VOClFnOuj' : 'audio-CeDJSLKXnC4lwR0t1XYzlSlu09w0Em'}.${canPlay ? 'png' : 'jpg'}`}
          />
        )}
      />
      <p className={style.text}>Haz clic en cada letra para escuchar la pronunciación y repetir después del beep.</p>

      {feedback.canShow && (
        <p
          className={style.feedback}
          style={{ background: feedback.isCorrect ? 'green' : 'red', color: 'white' }}>
          {feedback.message}
        </p>
      )}

      <div className={style['letter-grid']}>
        {word.sentences.map(({ englishWord, audioUrl }, index) => (
          <Speech
            audioUrl={audioUrl}
            canNext={pronunciation}
            canShowMessage={false}
            interimResults
            key={index}
            onCheck={(isCorrect: boolean) => onCheck(isCorrect, englishWord)}
            onPlaySpeech={onPlaySpeech}
            word={englishWord}
            custom={({ onPlay, canPlay, onStop }) => {
              const isBlocked: boolean = sentenceIndex < index;
              const classNameAnimation: string = (
                !canPlay || displayedLettersLen === index + 1
              ) ? `${style.beat} ${style['letter-animation']}` : '';

              return (
                <div
                  key={index}
                  className={`${style.letter} ${classNameAnimation}`}
                  style={{ filter: isBlocked ? 'grayscale(100%)' : '' }}
                  onClick={() => {
                    canPlay
                      ? onSpeach({ index, onPlay, englishWord, audioUrl })
                      : onStop();
                  }}
                >
                  <span>{englishWord}</span>
                </div>
              )
            }
            }
          />
        ))}
      </div>
    </div>
  );
};

export default Exercise;
