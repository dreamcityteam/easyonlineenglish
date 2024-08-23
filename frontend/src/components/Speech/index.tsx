import React, { useState } from 'react';
import { formatWord, getClassName, gethPathWordpress, removeAccents } from '../../tools/function';
import Image from '../Image';
import style from './style.module.sass';

interface Props {
  word: string;
  audioUrl: string;
  onCheck: (isCorrect: boolean, pronunciation: string) => void;
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
  const startText: string = 'Ahora Pronunciar';
  const endText: string = 'Escucha el audio';

  const startListening = (): void => {
    const pronunciationAudio: HTMLAudioElement = new Audio(audioUrl);
    const whistleAudio: HTMLAudioElement = new Audio(gethPathWordpress('2016/12/pronunciation.mp3'));

    pronunciationAudio.play();
    setCanPlay(true);
    onPlaySpeech && onPlaySpeech(true);

    pronunciationAudio.onended = (): void => {
      pronunciation();
      setTimeout(() => {
        whistleAudio.play();
        setOutput(startText);
      }, 500);
    }

    const pronunciation = (): void => {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.lang = 'en-US';
      recognition.interimResults = false;

      setRecognition(recognition);

      recognition.continuous = true;

      recognition.onresult = (event: any): void => {
        const transcript: any = event.results[event.results.length - 1][0].transcript;
        const pronunciation = formatWord(transcript);
        const wordFormated: string = removeAccents(formatWord(word));

        console.log(pronunciation, wordFormated);

        onCheck(
          pronunciation === wordFormated ||
          !!canNext[wordFormated] && canNext[wordFormated].includes(pronunciation),
          pronunciation
        );
        setCanPlay(false);
        setOutput(endText);
        recognition.stop();
      }

      recognition.onerror = (event: any): void => {
        setCanPlay(false);

        switch (event.error) {
          case 'no-speech':
            setOutput('No se detectó ninguna voz. Por favor, intente de nuevo.');
            break;
          case 'aborted':
            setOutput('La captura de voz se ha abortado.');
            break;
          case 'audio-capture':
            setOutput('No se puede capturar el audio. Asegúrese de que el micrófono esté funcionando.');
            break;
          case 'network':
            setOutput('Error de red. Verifique su conexión a internet.');
            break;
          case 'not-allowed':
            setOutput('Active el micrófono.');
            break;
          case 'service-not-allowed':
            setOutput('El servicio de reconocimiento de voz no está permitido.');
            break;
          case 'bad-grammar':
            setOutput('Error en la gramática de la solicitud.');
            break;
          case 'language-not-supported':
            setOutput('El idioma especificado no es compatible.');
            break;
          default:
            setOutput('Su navegador no soporta esta funcionalidad.');
            break;
        }
      }

      recognition.onend = (): void => {
        setCanPlay(false);
        onPlaySpeech && onPlaySpeech(false);
        setOutput(endText);
      }

      recognition.start();
    }
  }

  const onStop = (): void => {
    recognition && recognition.stop();
  }

  return (
    <div className={style.speech}>
      {canPlay && output === startText ? (
        <Image
          alt="Stop pronunciation"
          className={getClassName(style.speech__icon, `${output === startText ? style.speech__beatAnimation : ''}`)}
          onClick={onStop}
          path="icons/microphone-WxMHE7VDCtwzsST9vrQOMFGL78dPYt.png"
        />
      ) : (
        <Image
          alt="Play pronunciation"
          className={style.speech__icon}
          onClick={startListening}
          path="icons/audio-CeDJSLKXnC4lwR0t1XYzlSlu09w0Em.jpg"
        />
      )}
      {canShowMessage && <p className={style.speech__feedback}>{output || endText}</p>}
    </div>
  );
}

export default Speech;
