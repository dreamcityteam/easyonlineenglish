import React, { useRef, useState } from 'react';
import { formatWord, getClassName, gethPathWordpress, removeAccents } from '../../tools/function';
import Image from '../Image';
import style from './style.module.sass';
import { END_TEXT, START_TEXT } from './const';

interface Props {
  audioUrl: string;
  canNext?: { [key: string]: string[]; },
  canShowMessage?: boolean;
  onCheck: (isCorrect: boolean, pronunciation: string) => void;
  onPlaySpeech?: (isCorrect: boolean) => void;
  word: string;
  interimResults?: boolean;
  custom?: ({ canPlay, onStop, onPlay, text }: { canPlay: boolean; onStop: () => void; onPlay: () => void; text: string; }) => JSX.Element;
};

const Speech: React.FC<Props> = ({
  word,
  onCheck,
  audioUrl,
  onPlaySpeech,
  canNext = {},
  canShowMessage = true,
  interimResults = false,
  custom
}): JSX.Element => {
  const [output, setOutput] = useState<string>('');
  const [canPlay, setCanPlay] = useState<boolean>(false);
  const SpeechRecognitionRef = useRef<SpeechRecognition>();

  const startListening = (): void => {
    const pronunciationAudio: HTMLAudioElement = new Audio(audioUrl);
    const whistleAudio: HTMLAudioElement = new Audio(gethPathWordpress('2016/12/pronunciation.mp3'));

    pronunciationAudio.play();
    setCanPlay(true);
    onPlaySpeech && onPlaySpeech(true);

    pronunciationAudio.onended = (): void => {
      initializeRecognition();
      setTimeout(() => {
        whistleAudio.play();
        setOutput(START_TEXT);
      }, 500);
    }

    const initializeRecognition = (): void => {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      SpeechRecognitionRef.current = new SpeechRecognition();

      if (SpeechRecognitionRef.current) {
        SpeechRecognitionRef.current.lang = 'en-US';
        SpeechRecognitionRef.current.interimResults = interimResults;
        SpeechRecognitionRef.current.continuous = true;

        SpeechRecognitionRef.current.onresult = handlerOnResult;
        SpeechRecognitionRef.current.onerror = handlerOnError;
        SpeechRecognitionRef.current.onend = handlerOnEnd;
        SpeechRecognitionRef.current.start();
      }
    }
  }

  const handlerOnResult = (event: SpeechRecognitionEvent): void => {
    const transcript: string = event.results[event.results.length - 1][0].transcript;
    const formattedTranscript: string = formatWord(transcript).trim();
    const formattedWord: string = removeAccents(formatWord(word));

    console.log(
      `Pronunciación': ${formattedTranscript}`,
      `\nTexto: ${formattedWord}`
    );

    const isCorrect: boolean = formattedTranscript === formattedWord ||
      !!canNext[formattedWord]?.includes(formattedTranscript);

    SpeechRecognitionRef.current?.stop();
    SpeechRecognitionRef.current = undefined;
    onCheck(isCorrect, formattedTranscript);
    setCanPlay(false);
    setOutput(END_TEXT);
  }

  const handlerOnEnd = (): void => {
    setCanPlay(false);
    onPlaySpeech && onPlaySpeech(false);
    setOutput(END_TEXT);
  }

  const handlerOnError = (event: SpeechRecognitionErrorEvent): void => {
    setCanPlay(false);

    const errorMessages: { [key: string]: string } = {
      'no-speech': 'No se detectó ninguna voz. Por favor, intente de nuevo.',
      'aborted': 'La captura de voz se ha abortado.',
      'audio-capture': 'No se puede capturar el audio. Asegúrese de que el micrófono esté funcionando.',
      'network': 'Error de red. Verifique su conexión a internet.',
      'not-allowed': 'Active el micrófono.',
      'service-not-allowed': 'El servicio de reconocimiento de voz no está permitido.',
      'bad-grammar': 'Error en la gramática de la solicitud.',
      'language-not-supported': 'El idioma especificado no es compatible.',
      'default': 'Su navegador no soporta esta funcionalidad.'
    };

    setOutput(errorMessages[event.error] || errorMessages['default']);
  }

  const onStop = (): void =>
    SpeechRecognitionRef.current && SpeechRecognitionRef.current.stop();

  return (
    <>
      {custom ? custom({
        canPlay: !(canPlay && output === START_TEXT),
        onStop,
        onPlay: canPlay ? () => { } : startListening,
        text: output || END_TEXT
      }) :
        <div className={style.speech}>
          {canPlay && output === START_TEXT ? (
            <Image
              alt="Stop pronunciation"
              className={getClassName(
                style.speech__icon,
                (output === START_TEXT)
                  ? style.speech__beatAnimation
                  : ''
              )}
              onClick={onStop}
              path="icons/microphone-WxMHE7VDCtwzsST9vrQOMFGL78dPYt.png"
            />
          ) : (
            <Image
              alt="Play pronunciation"
              className={style.speech__icon}
              onClick={canPlay ? () => { } : startListening}
              path="icons/audio-CeDJSLKXnC4lwR0t1XYzlSlu09w0Em.jpg"
            />
          )}
          {canShowMessage && <p className={style.speech__feedback}>{output || END_TEXT}</p>}
        </div>
      }
    </>
  );
}

export default Speech;
