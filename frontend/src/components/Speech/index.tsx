import React, { useState } from 'react';
import SVGStopAudio from '../../../public/svg/stopAudioWhite.svg';
import style from './style.module.sass';
import SVGMicrophone from '../../../public/svg/microphone.svg';

interface Props {
  word: string;
  audioUrl: string;
  onCheck: (isCorrect: boolean) => void;
  onPlaySpeech?: (isCorrect: boolean) => void;
  canNext?: { [key: string]: string[]; },
  canShowMessage?: boolean;
};

const Speech: React.FC<Props> = ({
  word,
  onCheck,
  audioUrl,
  onPlaySpeech,
  canNext = {},
  canShowMessage = true
}): JSX.Element => {
  const [output, setOutput] = useState<string>('');
  const [canPlay, setCanPlay] = useState<boolean>(false);
  const [recognition, setRecognition] = useState<any>(null);

  const startListening = (): void => {
    const pronunciationAudio: HTMLAudioElement = new Audio(audioUrl);
    const whistleAudio: HTMLAudioElement = new Audio('https://easyonlineenglish.com/wp-content/uploads/2016/12/pronunciation.mp3');

    pronunciationAudio.play();
    setCanPlay(true);
    onPlaySpeech && onPlaySpeech(true);

    pronunciationAudio.onended = () => {
      whistleAudio.play();
    }

    whistleAudio.onended = () => {
      pronunciation();
    }

    const pronunciation = (): void => {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.lang = 'en-US';
      recognition.interimResults = false;

      setRecognition(recognition);

      recognition.continuous = true;

      recognition.onstart = (): void => {
        setOutput('Ahora Pronunciar');
      }

      recognition.onresult = (event: any): void => {
        const transcript: any = event.results[event.results.length - 1][0].transcript;
        const pronunciation = formatWord(transcript);
        const wordFormated: string = removeAccents(formatWord(word));

        console.log(pronunciation, wordFormated);

        onCheck(
          pronunciation === wordFormated ||
          !!canNext[wordFormated] && canNext[wordFormated].includes(pronunciation) 
        );
        setCanPlay(false);
        setOutput('Escuchar pronunciación');
        recognition.stop();
      }

      recognition.onerror = (event: any): void => {       
        setCanPlay(false);

        if (event.error === 'not-allowed') {
          setOutput('Active el microfono.');
        } else {
          console.log('Su navegador no soporta esta funcionalidad.');
        }
      }

      recognition.onend = (): void => {
        setCanPlay(false);
        onPlaySpeech && onPlaySpeech(false);
        setOutput('Escuchar pronunciación');
      }

      recognition.start();
    }
  }

  const formatWord = (word: string): string => 
    word.toLowerCase().replace(/\.|\?|,/g, '');

  const onStop = (): void => {
    recognition && recognition.stop();
  }

  const removeAccents = (str: string): string =>
    str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  return (
    <div className={style.speech}>
      {canPlay ? (
        <img
          alt="Stop pronunciation"
          className={style.speech__icon}
          onClick={onStop}
          src={SVGStopAudio}
        />
      ) : (
        <img
          alt="Play pronunciation"
          className={style.speech__icon}
          onClick={startListening}
          src={SVGMicrophone}
        />
      )}
      {canShowMessage && <p className={style.speech__feedback}>{output || 'Escuchar pronunciación'}</p>}
    </div>
  );
}

export default Speech;
