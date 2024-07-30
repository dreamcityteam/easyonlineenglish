import React, { useState, useEffect } from 'react';
import styleDefault from './style.module.sass';
import Image from '../Image';

interface Props {
  src: string;
  style: { [key: string]: any };
}

const Sound: React.FC<Props> = ({ src, style = {} }): JSX.Element => {
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
      {canPlay ? (
        <Image
          alt="Stop pronunciation"
          className={`${style.sound__icon}  ${styleDefault.sound__icon}`}
          path="icons/pause-audio-GCNorppjLX90z5rrDmSxm2aYWCK8XK.avif"
          onClick={handleTogglePlay}
        />
      ) : (
        <Image
          alt="Play pronunciation"
          className={`${style.sound__icon}  ${styleDefault.sound__icon}`}
          path="icons/play-audio-ZNHpsTvarg2rllIwC6PnU6W6Fqrm5f.avif"
          onClick={handleTogglePlay}
        />
      )}
      <audio
        ref={audioRef}
        src={src}
      />
    </div>
  );
};

export default Sound;
