import React, { useState, useEffect } from 'react';
import styleDefault from './style.module.sass';
import Image from '../Image';
import { getClassName } from '../../tools/function';

interface Props {
  src: string;
  style: { [key: string]: any };
  render?: (canPlay?: boolean) => JSX.Element;
  slowAudioUrl?: string;
  stop?: boolean;
  onCurrentTime?: (currentTime: number) => void;
  onStop?: () => void;
}

const Sound: React.FC<Props> = ({
  src,
  style = {},
  render,
  slowAudioUrl,
  stop,
  onCurrentTime = () => {},
  onStop = () => {},
}): JSX.Element => {
  const [canPlay, setCanPlay] = useState<boolean>(false);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const [isSlowAudio, setIsSlowAudio] = useState(false);
  const [update, setUpdate] = useState<any>(null);

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
    setCanPlay(false);
  }, [src, stop]);

  const handleAudioEnded = (): void => {
    setCanPlay(false);
    setIsSlowAudio((isSlowAudio: boolean) => !!slowAudioUrl ? !isSlowAudio : false);
  };

  const handlerOnCurrentTime = () => {
    const interval = setInterval(() => {
      const time: number = audioRef.current?.currentTime || 0;

      if (audioRef.current?.duration === time) {
        clearInterval(interval);
        onStop();
      }

      onCurrentTime(time);
    });

    setUpdate(interval);
  }

  const handleTogglePlay = (): void => {
    if (audioRef.current) {
      if (audioRef.current.paused) {
        audioRef.current.play();
        setCanPlay(true);
        handlerOnCurrentTime();
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
      clearInterval(update);
    }
  }

  return (
    <div
      className={`${style.sound} ${styleDefault.sound}`}
    >
      {render
        ? <div onClick={handleTogglePlay}>{render(canPlay)}</div>
        : (
          <Image
            alt={`${canPlay ? 'Stop' : 'Play'} pronunciation`}
            className={getClassName(style.sound__icon, styleDefault.sound__icon)}
            path={`icons/${canPlay ? 'pausa-CdNhAEsQLGS76ysd8YFV9VOClFnOuj.png' : 'audio-CeDJSLKXnC4lwR0t1XYzlSlu09w0Em.jpg'}`}
            onClick={handleTogglePlay}
          />
        )}
      <audio
        ref={audioRef}
        src={isSlowAudio ? slowAudioUrl : src}
      />
    </div>
  );
};

export default Sound;
