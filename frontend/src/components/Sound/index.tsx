import React, { useState, useEffect } from 'react';
import styleDefault from './style.module.sass';
import Image from '../Image';
import { getClassName } from '../../tools/function';

interface Props {
  src: string;
  style: { [key: string]: any };
  render?: () => JSX.Element;
  slowAudioUrl?: string;
  stop?: boolean;
}

const Sound: React.FC<Props> = ({
  src,
  style = {},
  render,
  slowAudioUrl,
  stop
}): JSX.Element => {
  const [canPlay, setCanPlay] = useState<boolean>(false);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const [isSlowAudio, setIsSlowAudio] = useState(false);

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

  useEffect(() => {
    setIsSlowAudio(false);
    stop && stopAudio();
    setCanPlay(false)
  }, [src, stop]);

  const handleAudioEnded = (): void => {
    setCanPlay(false);
    setIsSlowAudio((isSlowAudio: boolean) => !!slowAudioUrl ? !isSlowAudio : false);
  };

  const handleTogglePlay = (): void => {
    if (audioRef.current) {
      if (audioRef.current.paused) {
        audioRef.current.play();
        setCanPlay(true);
      } else {
        stopAudio();
      }
    }
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsSlowAudio((isSlowAudio: boolean) => !!slowAudioUrl ? !isSlowAudio : false);
      setCanPlay(false);
    }
  }

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
        src={isSlowAudio ? slowAudioUrl : src}
      />
    </div>
  );
};

export default Sound;
