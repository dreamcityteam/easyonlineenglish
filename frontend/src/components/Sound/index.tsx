import React, { useState, useEffect } from 'react';
import styleDefault from './style.module.sass';
import Image from '../Image';
import { getClassName } from '../../tools/function';

interface Props {
  src: string;
  style: { [key: string]: any };
  render?: () => JSX.Element;
}

const Sound: React.FC<Props> = ({ src, style = {}, render }): JSX.Element => {
  const [canPlay, setCanPlay] = useState<boolean>(false);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener('ended', handleAudioEnded);
    }

    return (): void => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('ended', handleAudioEnded);
      }
    };
  }, []);

  const handleAudioEnded = (): void => {
    setCanPlay(false);
  };

  const handleTogglePlay = (): void => {
    if (audioRef.current) {
      if (audioRef.current.paused) {
        audioRef.current.play();
        setCanPlay(true);
      } else {
        audioRef.current.pause();
        setCanPlay(false);
      }
    }
  };


  return (
    <div
      className={`${style.sound} ${styleDefault.sound}`}
    >
      {render
        ? <div onClick={handleTogglePlay}>{render()}</div>
        : (
          canPlay ? (
            <Image
              alt="Stop pronunciation"
              className={getClassName(style.sound__icon, styleDefault.sound__icon)}
              path="icons/pausa-CdNhAEsQLGS76ysd8YFV9VOClFnOuj.png"
              onClick={handleTogglePlay}
            />
          ) : (
            <Image
              alt="Play pronunciation"
              className={getClassName(style.sound__icon, styleDefault.sound__icon)}
              path="icons/audio-CeDJSLKXnC4lwR0t1XYzlSlu09w0Em.jpg"
              onClick={handleTogglePlay}
            />
          )
        )}

      <audio
        ref={audioRef}
        src={src}
      />
    </div>
  );
};

export default Sound;
