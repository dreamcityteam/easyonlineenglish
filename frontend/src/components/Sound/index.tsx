import React, { useState, useEffect } from 'react';
import styleDefault from './style.module.sass';
import { getPath } from '../../tools/function';

interface Props {
  src: string;
  style: { [key: string]: any };
  width?: string;
}

const Sound: React.FC<Props> = ({ src, style = {}, width = 'auto' }): JSX.Element => {
  const [canPlay, setCanPlay] = useState<boolean>(false);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener('ended', handleAudioEnded);
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('ended', handleAudioEnded);
      }
    };
  }, []);

  const handleAudioEnded = () => {
    setCanPlay(false);
  };

  const handleTogglePlay = () => {
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
      {canPlay ? (
        <img
          alt="Stop pronunciation"
          className={`${style.sound__icon}  ${styleDefault.sound__icon}`}
          src={getPath('2023/11/pause-audio.avif')}
          onClick={handleTogglePlay}
          style={{ width }}
        />
      ) : (
        <img
          alt="Play pronunciation"
          className={`${style.sound__icon}  ${styleDefault.sound__icon}`}
          src={getPath('2023/11/play-audio.avif')}
          onClick={handleTogglePlay}
          style={{ width }}
        />
      )}
      <audio ref={audioRef} src={src}></audio>
    </div>
  );
};

export default Sound;
