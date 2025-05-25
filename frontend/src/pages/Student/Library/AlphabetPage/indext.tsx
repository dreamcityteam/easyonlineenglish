import React, { useMemo, useRef, useState } from 'react';
import style from './style.module.sass';
import { alphabet } from './data';
import Speech from '../../../../components/Speech';
import pronunciation from './pronunciation.json';
import Image from '../../../../components/Image';
import Sound from '../../../../components/Sound';


const AlphabetPage: React.FC = () => {
  const refButtonAudio = useRef(null);
  const [displayedLetters, setDisplayedLetters] = useState<{ [key: string]: boolean; }>({});
  const displayedLettersLen: number = useMemo(() => Object.keys(displayedLetters).length, [displayedLetters]);

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

  const onPlaySpeech = (isPlay: boolean, englishWord: string): void => {
    isPlay && setSpeech((currentState) => ({
      ...currentState,
      [englishWord]: { isCorrect: false, canShow: false }
    }));
  }

  const Feedback = ({ englishWord }: { englishWord: string; }): JSX.Element => (
    <>
      {typeof speech[englishWord] !== 'undefined' && speech[englishWord].canShow && (
        <div style={{ position: 'absolute' }}>
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

  const onCurrentTime = (time: number) => {
    const delta = 0.05;
    const letterTimings: [number, string][] = [
      [3.8, 'a'], [4.6, 'b'], [5.6, 'c'], [6.6, 'd'], [7.6, 'e'], [8.0, 'f'],
      [8.6, 'g'], [9.0, 'h'], [9.6, 'i'], [10.0, 'j'], [10.6, 'k'], [11.4, 'l'],
      [12.0, 'm'], [12.4, 'n'], [13.4, 'o'], [14.0, 'p'], [15.0, 'q'], [15.5, 'r'],
      [16.0, 's'], [16.4, 't'], [17.3, 'u'], [17.6, 'v'], [18.0, 'w'], [19.0, 'x'],
      [19.6, 'y'], [20.8, 'z'], [22.8, 'a'], [23.6, 'b'], [24.6, 'c'], [25.6, 'd'],
      [26.6, 'e'], [27.0, 'f'], [27.6, 'g'], [28.0, 'h'], [28.6, 'i'], [29.0, 'j'],
      [29.6, 'k'], [30.4, 'l'], [31.0, 'm'], [31.4, 'n'], [32.4, 'o'], [33.0, 'p'],
      [34.0, 'q'], [34.5, 'r'], [35.0, 's'], [35.4, 't'], [36.3, 'u'], [36.6, 'v'],
      [37.0, 'w'], [38.0, 'x'], [38.6, 'y'], [39.8, 'z']
    ];

    // Clear condition
    if (Math.abs(time - 22.5) <= delta || Math.abs(time - 41.8) <= delta) {
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

    if (canPlay) {
      setDisplayedLetters({});
    }
  }

  return (
    <div className={`${style['alphabet-page']}`}>
      {/* @ts-ignore */}
      <div className={`${displayedLettersLen ? style.moving : ''} ${style.logo}`}>
        <span className={style.red}>A</span>
        <span className={style.blue}>B</span>
        <span className={style.red}>C</span>
      </div>

      <h1 className={style.title}>Aprende el alfabeto</h1>

      <Sound
        src="https://coachingresourcecenter.com/wp-content/uploads/easyonlineenglish/2024/07/EOE%20Alphabet%20Song%20by%20Zamir.mp3"
        style={{}}
        onCurrentTime={onCurrentTime}
        render={(canPlay = false) => (
          <button
            onClick={() => onMusic(canPlay)}
            ref={refButtonAudio}
            data-play={canPlay}
            className={style['song-button']}
          >
            {canPlay ? '❚❚' : '▶'} Escucha la canción
          </button>
        )
        }
      />

      <div className={style['letter-grid']}>
        {alphabet.map(({ englishLetter, pronunciationLetter }, index) => (
          <Speech
            key={index}
            audioUrl={pronunciationLetter}
            onCheck={(isCorrect: boolean) => onCheck(isCorrect, englishLetter)}
            onPlaySpeech={(isPlay: boolean) => onPlaySpeech(isPlay, englishLetter)}
            word={englishLetter}
            canShowMessage={false}
            canNext={pronunciation}
            interimResults
            custom={({ onPlay, onStop, canPlay }) => (
              <div
                key={index}
                className={
                  `${canPlay
                      ? '' : style.beat} ${style.letter} ${index % 2 === 0 ? style['red-border']
                      : style['blue-border']

                  } ${displayedLetters[englishLetter] ? `${style.beat} ${style['letter-animation']}` : ''}`}
                onClick={() => {
                  // @ts-ignore
                  displayedLettersLen && refButtonAudio.current?.click();
                  canPlay ? onPlay() : onStop();
                }}
              >
                {englishLetter}
                <Feedback englishWord={englishLetter} />
              </div>
            )}
          />
        ))}
      </div>
    </div>
  );
};

export default AlphabetPage;
