import React, { useState, useEffect } from 'react';
import SVGStopAudio from '../../../public/svg/stopAudio.svg';
import SVGMPlay from '../../../public/svg/playAudio.svg';
import styleDefault from './style.module.sass';

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
          src={SVGStopAudio}
          onClick={handleTogglePlay}
          style={{ width }}
        />
      ) : (
        <img
          alt="Play pronunciation"
          className={`${style.sound__icon}  ${styleDefault.sound__icon}`}
          src={SVGMPlay}
          onClick={handleTogglePlay}
          style={{ width }}
        />
      )}
      <audio ref={audioRef} src={src}></audio>
    </div>
  );
};

export default Sound;
