import React, { useMemo, useRef, useState } from 'react';
import style from './style.module.sass';
import { alphabet } from './data';
import Speech from '../../../../components/Speech';
import pronunciation from './pronunciation.json';
import Sound from '../../../../components/Sound';

const AlphabetPage: React.FC = () => {
  const refButtonAudio = useRef(null);
  const [displayedLetters, setDisplayedLetters] = useState<{ [key: string]: boolean; }>({});
  const displayedLettersLen: number = useMemo(() => Object.keys(displayedLetters).length, [displayedLetters]);
  const [currentLetter, setCurrentLetter] = useState<{
    audioUrl: string
    word: string
  } | null>(null);
  const [canReapet, setCanReapet] = useState(true);

  const [speech, setSpeech] = useState<{
    [key: string]: {
      isCorrect: boolean;
      canShow: boolean;
      message: string;
    };
  }>({});

  const onCheck = (isCorrect: boolean, englishWord: string): void => {
    setSpeech((currentState) => ({
      ...currentState,
      [englishWord]: {
        canShow: true,
        isCorrect,
        message: !isCorrect ? '¡Vuelve a intentarlo!' : '',
      }
    }));
  }

  const onPlaySpeech = (isPlay: boolean, englishWord: string): void => {
    isPlay && setSpeech((currentState) => ({
      ...currentState,
      [englishWord]: {
        isCorrect: false,
        canShow: false,
        message: ''
      }
    }));
  }

  const Feedback = ({ englishWord }: { englishWord: string; }): JSX.Element => (
    <>
      {typeof speech[englishWord] !== 'undefined' && speech[englishWord].canShow && (
        <div style={{ color: speech[englishWord].isCorrect ? 'green' : 'red' }} className={style['feedback-message']}>
          {speech[englishWord].isCorrect ? '¡Bien hecho!' : speech[englishWord].message}
        </div>
      )}
    </>
  )

  const onCurrentTime = (time: number) => {
    const delta = 0.05;
    const letterTimings: [number, string][] = [
      [0, 'a'], [0.4, 'b'], [1, 'c'], [1.4, 'd'], [2, 'e'], [2.4, 'f'],
      [3, 'g'], [4, 'h'], [4.4, 'i'], [5, 'j'], [5.4, 'k'], [6, 'l'],
      [6.4, 'm'], [6.6, 'n'], [6.8, 'o'], [7, 'p'], [8, 'q'], [8.4, 'r'],
      [9, 's'], [10, 't'], [10.4, 'u'], [11, 'v'], [11.8, 'w'], [12.8, 'x'],
      [13.8, 'y'], [15, 'z'], [18, 'a'], [18.4, 'b'], [19, 'c']
    ];

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
    setSpeech({});
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

  return (
    <div className={`${style['alphabet-page']}`}>
      {/* @ts-ignore */}
      <div className={style.logo}>
        <img src="https://abaw33hy9bfvxqdq.public.blob.vercel-storage.com/logoo-rm0KVx1dnUqQODjmO2SFdpkpH54uxf.png" />
      </div>
      <h2 className={style.title}>Alphabet</h2>
      <Sound
        src="https://coachingresourcecenter.com/wp-content/uploads/easyonlineenglish/2024/07/alfabeto.mp3"
        style={{}}
        onCurrentTime={onCurrentTime}
        onStop={onStopMusic}
        render={(canPlay = false) => (
          <>
            <img
              onClick={() => onMusic(canPlay)}
              ref={refButtonAudio}
              data-reapet={canReapet}
              className={style['song-button']}
              src={`https://abaw33hy9bfvxqdq.public.blob.vercel-storage.com/icons/${canPlay ? 'pausa-CdNhAEsQLGS76ysd8YFV9VOClFnOuj' : 'audio-CeDJSLKXnC4lwR0t1XYzlSlu09w0Em'}.${canPlay ? 'png' : 'jpg'}`}
            />
          </>
        )}
      />

      <p>Canta la canción</p>
      <p>Haz clic en cada letra para escuchar la pronunciación y repetir después del beep.</p>
      <div className={style['letter-grid']}>
        {alphabet.map(({ englishLetter, pronunciationLetter }, index) => {
          const classNameAnimation: string = (
            currentLetter?.word === englishLetter || displayedLettersLen === index + 1
          ) ? `${style.beat} ${style['letter-animation']}` : '';

          return (
            <div
              key={index}
              className={`${style.letter} ${classNameAnimation}`}

              onClick={() => {
                // @ts-ignore
                displayedLettersLen && refButtonAudio.current?.click();
                setCurrentLetter({
                  word: englishLetter,
                  audioUrl: pronunciationLetter
                });
                setCanReapet(true);
              }}
              style={index > 17 ? { left: '25px' } : {}}
            >
              {englishLetter}
            </div>
          )
        })}
      </div>

      {currentLetter && (
        <div className={style['letter-selected-container']}>
          <p>Haz clic en el botón para practicar tu pronunciación.</p>
          <div className={style['letter-selected']}>
            <div className={style.letter}>{currentLetter.word}</div>
            <Feedback englishWord={currentLetter.word} />
            <Speech
              audioUrl={currentLetter.audioUrl}
              onCheck={(isCorrect: boolean) => onCheck(isCorrect, currentLetter.word)}
              onPlaySpeech={(isPlay: boolean) => onPlaySpeech(isPlay, currentLetter.word)}
              word={currentLetter.word}
              canShowMessage={false}
              canNext={pronunciation}
              interimResults
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AlphabetPage;
