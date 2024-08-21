import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { Course as TCourse, Lesson, Sentence, Word } from '../../../global/state/type';
import Aside from './Aside';
import Speech from '../../../components/Speech';
import style from './style.module.sass';
import { CourseProgress, OnWord } from './types';
import { formatWord, getData, isAdmin, removeAccents, send, Storage } from '../../../tools/function';
import { SET_COURSE_CACHE } from '../../../global/state/actionTypes';
import context from '../../../global/state/context';
import { HTTP_STATUS_CODES } from '../../../tools/constant';
import { Response } from '../../../tools/type';
import pronunciation from './pronunciation.json';
import { LESSIONS_COUNT, messagesCorrect, messagesWrong } from './data';
import ModalWrongPronunciation from './ModalWrongPronunciation';
import ModalCongratulation from './ModalCongratulation';
import Image from '../../../components/Image';
import Head from './Head';
import ModalRating from './ModalRating';
import ModalTips from './ModalTips';

interface Props {
  isDemo?: boolean;
}

const Course: React.FC<Props> = ({ isDemo = false }): JSX.Element => {
  const { idCourse } = useParams<string>();
  const [{ courseCache, googleAnalytics, user }, dispatch] = useContext(context);
  const [feedback, setFeedback] = useState({ canShow: false, message: '' });
  const [isPlaySpeech, setPlaySpeech] = useState<boolean>(false);
  const [lessionTitle, setLessionTitle] = useState<string>('');
  const [course, setCourse] = useState<TCourse>();
  const [sentence, setSentence] = useState<Sentence>();
  const [word, setWord] = useState<Word>();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [canShowModal, setCanShowModal] = useState<boolean>(false);
  const [sentenceIndex, setSentenceIndex] = useState<number>(0);
  const [lessonIndex, setLessonIndex] = useState<number>(0);
  const [wordIndex, setWordIndex] = useState<number>(0);
  const [isSavingProgress, setIsSavingProgress] = useState<boolean>(false);
  const idCache: string = isDemo ? `${idCourse}-demo` : idCourse || '';
  const [canDisabledAudio, setCanDisabledAudio] = useState<boolean>(false);
  const [countPronunciation, setCountPronunciation] = useState<number>(1);
  const [wrongPronunciationMessage, setWrongPronunciationMessage] = useState<boolean>(false);
  const [isCorrectPronuciation, setIsCorrectPronunciation] = useState<boolean>(false);
  const [pronunciationFeedback, setPronunciationFeedback] = useState<string>('');
  const [canSlowAudio, setCanSlowAudio] = useState<{ [key: string]: { audio: null | HTMLAudioElement; canPlay: boolean; } }>({
    word: {
      audio: null,
      canPlay: false
    },
    sentence: {
      audio: null,
      canPlay: false
    }
  });
  const [canShowModalRating, setCanShowModalRating] = useState<boolean>(false);

  useEffect(() => {
    saveCourseData();
  }, []);

  const getAudioInitialize = () => ({
    audio: null,
    canPlay: false
  });

  const disabledSlowAudio = (): void =>
    setCanSlowAudio({
      word: getAudioInitialize(),
      sentence: getAudioInitialize(),
    });

  const saveCourseCacheData = (course: TCourse): void =>
    dispatch({ type: SET_COURSE_CACHE, payload: { ...course, idCourse: idCache } });

  const saveCourseData = async (): Promise<void> => {
    const cache: TCourse = courseCache[idCache];

    if (cache) {
      setCourseData(cache);
      return;
    }

    await getData({
      modal: { dispatch, text: 'Cargando curso' },
      service: {
        method: 'get',
        endpoint: isDemo ? 'student-course-demo' : `student-course/${idCourse}`
      },
      success: ({ words, ...data }): void => {
        const course = { ...data, lessons: formatLessons(words) };
        const eventGoogle = isDemo ? 'course-demo' : 'course';

        setCourseData(course);
        saveCourseCacheData(course);

        googleAnalytics('event', eventGoogle, {
          'event_category': eventGoogle,
          'event_label': `Curso - ${course.title}`
        });
      }
    });
  };

  const formatLessons = (words: Word[]): Lesson[] => {
    type Lessons = { title: string; words: Word[]; };
    const getLessonData = (title: string) => ({ title: `Lección ${title}`, words: [] });
    const lessons: Lessons[] = [getLessonData(LESSIONS_COUNT[0])];
    let currentLesson: Lessons = lessons[0];

    words.forEach((word: Word, index: number): void => {
      currentLesson.words.push(word);

      if ((index + 1) % 25 === 0) {
        const len: number = lessons.length;

        lessons.push(getLessonData(LESSIONS_COUNT[len]));
        currentLesson = lessons[len];
      }
    });

    if (currentLesson.words.length === 0) lessons.pop();

    return lessons;
  };

  const setCourseData = (course: TCourse): void => {
    const currentLession: Lesson = course.lessons[course.index.lesson];
    let sentenceIndex: number = 0;
    let currentWord: Word = currentLession.words[course.index.word];

    if (course.completedWords[currentWord._id]) {
      currentWord = getWordSentenceCompleted(currentWord);
    } else if (course.index.sentence > 0) {
      sentenceIndex = course.index.sentence;
      currentWord = getWordSentenceCompleted(currentWord, course.index.sentence);
    }

    setLessons(course.lessons);
    setWord(currentWord);
    setLessionTitle(currentLession.title);
    setSentence(currentWord.sentences[sentenceIndex]);
    setCourse(course);
    setLessonIndex(course.index.lesson);
    setWordIndex(course.index.word);
    setSentenceIndex(sentenceIndex);
  }

  const onWord = ({ word, indexLesson, wordIndex, canTakeNextWord }: OnWord): void => {
    const sentenceIndex: number = 0;
    let newWord: Word = { ...word };

    if (
      course?.completedWords[newWord._id] &&
      newWord.sentences.length &&
      !newWord.sentences[0]?.isCompleted
    ) {
      // We need to find a way to remove unnecessary iterations
      // Also, to add this word to the course state.
      newWord = getWordSentenceCompleted(word);
    }

    if (course && course.index.sentence > 0 && !canTakeNextWord) {
      newWord = getWordSentenceCompleted(word, course?.index.sentence);
    }

    if (
      course?.unlockedWords[word._id] ||
      canTakeNextWord ||
      isAdmin(user)
    ) {
      setWord(newWord);
      setSentence(newWord.sentences[sentenceIndex]);
      setLessionTitle(lessons[indexLesson].title);
      setLessonIndex(indexLesson);
      setWordIndex(wordIndex);
      setSentenceIndex(sentenceIndex);
      cleanFeedback();
    }

    disabledSlowAudio();
    setCountPronunciation(0);
  };

  const getWordSentenceCompleted = (word: Word, sentenceIndex?: number): Word => {
    const newState: Word = { ...word };

    newState.sentences = word.sentences.map(
      (sentence: Sentence, index: number): Sentence => ({
        ...sentence,
        isCompleted: typeof sentenceIndex === 'number' ? (sentenceIndex > index) : true
      })
    );

    return newState;
  };

  const onPrev = (): void => {
    (sentenceIndex > 0) && update(sentenceIndex - 1);
  }

  const onNext = (): void => {
    const len: number = word ? (word.sentences.length - 1) : 0;

    if (sentenceIndex < len) {
      update(sentenceIndex + 1);
    } else if (sentenceIndex === len && course) {
      const nextWordIndex: number = wordIndex + 1;
      const nextLessionIndex: number = lessonIndex + 1;
      const nextWord: Word = lessons[lessonIndex].words[nextWordIndex];
      const nextLession: Lesson = lessons[nextLessionIndex];

      if (nextWord) {
        handleNextWord(nextWord, nextWordIndex, lessonIndex);
      } else if (nextLession) {
        const nextWord: Word = course.lessons[nextLessionIndex].words[0];

        if ((course.index.lesson < nextLessionIndex)) {
          setCanShowModalRating(true);
        }

        handleNextWord(nextWord, 0, nextLessionIndex);
      } else {
        handleNextWord(word, wordIndex, lessonIndex, true);
      }

      disabledSlowAudio();
    }
  };

  const handleNextWord = async (
    nextWord: any,
    nextWordIndex: number,
    nextLessonIndex: number,
    isCourseCompleted: boolean = false
  ): Promise<void> => {
    if (course && word) {
      const onNextWord = (canTakeNextWord: boolean = false): void =>
        onWord({
          word: nextWord,
          indexLesson: nextLessonIndex,
          wordIndex: nextWordIndex,
          canTakeNextWord
        });

      const updateStateCourse = (courseProgress: CourseProgress): void => {
        setCourse((currentState: any) => {
          const {
            completedWords, unlockedWords, index
          }: CourseProgress = courseProgress;

          currentState.completedWords[completedWords] = true;
          currentState.unlockedWords[unlockedWords] = true;
          currentState.index = index;

          saveCourseCacheData(currentState);
          return currentState;
        });
      };

      if (course.unlockedWords[nextWord._id] && !isCourseCompleted) return onNextWord();

      const courseProgress: CourseProgress = {
        idStudentCourse: course.idStudentCourse,
        completedWords: isCourseCompleted ? nextWord._id : word._id,
        unlockedWords: nextWord._id,
        index: { lesson: nextLessonIndex, word: nextWordIndex, sentence: 0 },
        progress: course.progress
      };

      if (!isDemo && !isAdmin(user)) {
        const {
          response: { statusCode, data }
        }: Response = await saveProgress(courseProgress);

        if (statusCode === HTTP_STATUS_CODES.OK) {
          courseProgress.progress = data.progress;
          updateStateCourse(courseProgress);

          if (isCourseCompleted) setCanShowModal(true);
          else onNextWord(true);
        } else {
          alert('No pudimos guardar su progreso. Por favor, revise su conexión a internet.');
        }
      } else {
        updateStateCourse(courseProgress);

        if (isCourseCompleted) setCanShowModal(true);
        else onNextWord(true);
      }
    }
  };

  const saveProgress = async (data: CourseProgress): Promise<Response> => {
    setIsSavingProgress(true);
    const response: Response = await send({ api: 'student-course-progress', data }).post();

    setIsSavingProgress(false);
    return response;
  };

  const update = (index: number): void => {
    if (!isPlaySpeech) {
      setSentenceIndex(index);
      setSentence(word?.sentences[index]);
      cleanFeedback();
    }

    setCountPronunciation(0);
  };

  const onSpeechFeedback = (isCorrect: boolean, pronunciation: string): void => {
    const isSkip: boolean = countPronunciation === 5;

    setPronunciationFeedback(pronunciation);

    setIsCorrectPronunciation(isCorrect);

    setFeedback({
      message: (isCorrect || isSkip)
        ? isSkip ? '¡Practicar más, lo lograrás!' : getFeedbackMessage().correct
        : getFeedbackMessage().wrong,
      canShow: true,
    });

    if (
      isSkip ||
      (isCorrect && !word?.sentences[sentenceIndex]?.isCompleted)
    ) {
      return skipWord();
    }

    if (countPronunciation === 3 && !isCorrect) {
      setWrongPronunciationMessage(true);
    }

    setCountPronunciation(countPronunciation + 1);
  };

  const getFeedbackMessage = () => {
    const getMessage = (messages: string[]) =>
      `${messages[Math.floor(Math.random() * messages.length)]}`;

    return {
      correct: getMessage(messagesCorrect),
      wrong: getMessage(messagesWrong)
    };
  };

  const skipWord = (): void => {
    setCountPronunciation(0);
    saveSentenceIndex();
    setWord((currentState: any) => {
      const newState = currentState;

      newState.sentences[sentenceIndex].isCompleted = true;

      return newState;
    });
  }

  const saveSentenceIndex = async (): Promise<void> => {
    if (course && word && !isAdmin(user) && !isDemo) {
      await send({
        api: 'student-updated-sentence-index',
        data: {
          index: (sentenceIndex === word.sentences.length - 1)
          ? sentenceIndex
          : sentenceIndex + 1,
          idStudentCourse: course?.idStudentCourse
        }        
      }).post();
    }
  }

  const onPlaySpeech = (isPlay: boolean): void => {
    isPlay && cleanFeedback();
    setPlaySpeech(isPlay);
    setCanDisabledAudio(isPlay);
  };

  const cleanFeedback = (): void =>
    setFeedback({ message: '', canShow: false });

  const getWordProgress = (): number => {
    const totalSentencesCount: number = word?.sentences?.length || 0;

    return totalSentencesCount === 0
      ? 0
      : Math.floor((getCompletedSentencesCount() / totalSentencesCount) * 100);
  };

  const getCompletedSentencesCount = (): number => {
    if (!word || !word.sentences) return 0;
    else if (course?.completedWords[word._id]) return word.sentences.length;

    return word.sentences.reduce(
      (currentState: number, nextState: any): number =>
        nextState.isCompleted ? currentState + 1 : currentState,
      0
    );
  };

  const handlerOnPlayAudio = (type: 'word' | 'sentence'): void => {
    const currentAudio = canSlowAudio[type];
    const isSentenceAudio: boolean = type === 'sentence';
    const url: string | undefined = isSentenceAudio
      ? (currentAudio.canPlay && sentence?.audioSlowUrl) || sentence?.audioUrl
      : word?.audioUrl;

    if (!url || canDisabledAudio) return;

    const audio: HTMLAudioElement = new Audio(url);

    if (currentAudio.audio) {
      currentAudio.audio.pause();
    }

    audio.play();

    if (canSlowAudio[type].canPlay && !sentence?.audioSlowUrl) {
      audio.playbackRate = 0.76;
    }

    setCanSlowAudio((prevState) => ({
      ...prevState,
      [type]: {
        audio: audio,
        canPlay: !canSlowAudio[type].canPlay
      },
    }));
  };

  const checkPronunciation = (
    sentence: string = '',
    pronunciation: string = ''
  ): JSX.Element | string => {

    if (!feedback.canShow || isCorrectPronuciation) {
      return sentence;
    }

    const formattedWords: string[] = removeAccents(formatWord(sentence)).split(' ');
    const pronunciations: string[] = pronunciation.toLowerCase().split(' ');
    const spliteWords: string[] = sentence.split(' ');

    return (
      <>
        {formattedWords.map((word: string, index: number): JSX.Element => {
          const isFirstWord: boolean = index === 0;
          let isMismatch: boolean = pronunciations.includes(word);

          if (isMismatch && (formattedWords.length === pronunciations.length)) {
            isMismatch = word === pronunciations[index];
          }

          const style: any = {
            borderBottom: isMismatch ? 'none' : '2px solid red',
            textTransform: isFirstWord ? 'capitalize' : 'none'
          };

          return <span key={index} style={style}> {spliteWords[index]} </span>;
        })}
      </>
    );
  };

  const BarStatus = ({ hiddenCount = false }): JSX.Element => {
    const percentage: number = getWordProgress();
    const style: any = {
      display: hiddenCount && percentage < 100 ? 'none' : 'inline'
    };

    return (
      <>
        <span>{percentage}% completado</span>
        <span style={style}>
          {getCompletedSentencesCount()} de{' '}
          {word?.sentences.length}
        </span>
      </>
    );
  }

  return (
    <>
      <Head
        title={course?.title || ''}
        description={course?.description || ''}
      />
      <section className={style.course}>
        {course && (
          <Aside
            isTutorial={isDemo}
            lessons={lessons}
            currentWord={course.index}
            completedWords={course.completedWords}
            onClick={onWord}
            title={course.title}
            lessonIndex={course.index.lesson}
          />
        )}
        <div className={style.course__container}>
          <div>
            <div className={style.course__lession_container}>
              <span
                className={`${style.course__text_grandient} ${style.course__text_lession}`}
              >
                {lessionTitle}
              </span>
            </div>
            <div className={style.course__englishWord_container}>
              <span
                onClick={() => handlerOnPlayAudio('word')}
                className={`${style.course__text_grandient} ${style.course__englishWord}`}
              >
                "{word?.englishWord}"
              </span>
            </div>
            <div className={style.course__spanishTranslation_container}>
              <span
                className={`${style.course__text_grandient} ${style.course__spanishTranslation}`}
              >
                {word?.spanishTranslation}
              </span>
            </div>
          </div>
          <div className={style.course__progress_container}>
            <div className={style.course__progress}>
              <div
                className={style.course__bar}
                style={{ width: `${getWordProgress()}%` }}
              >
                <BarStatus hiddenCount />
              </div>
              <BarStatus />
            </div>
            {isSavingProgress && (
              <div className={style.course__save_progress_container}>
                <span className={style.course__save_progress}>
                  Guadando progreso....
                </span>
              </div>
            )}
          </div>
          <div className={style.course__content_container}>
            <div className={style.course__content}>
              <div className={style.course__content_text}>
                <div>
                  <span
                    onClick={() => handlerOnPlayAudio('sentence')}
                    className={style.course__text_grandient}
                  >
                    {checkPronunciation(sentence?.englishWord, pronunciationFeedback)}
                  </span>
                </div>
                <span
                  className={style.course__text_language}
                >
                  Inglés
                </span>
              </div>
              <div className={style.course__feedback}>
                <LazyLoadImage
                  alt={sentence?.englishWord}
                  className={style.course__image}
                  effect="blur"
                  src={sentence?.imageUrl}
                />
                {feedback.canShow && (
                  <span
                    style={{ background: isCorrectPronuciation ? '#4caf50' : '#f44336' }}
                    className={style.course__message}>
                    {feedback.message}
                  </span>
                )}
              </div>
              <div className={style.course__content_text}>
                <div>
                  <span className={style.course__text_grandient}>
                    {sentence?.spanishTranslation}
                  </span>
                </div>
                <span className={style.course__text_language}>
                  Español
                </span>
              </div>
            </div>
          </div>
          <div className={style.course__pronunciation}>
            {sentenceIndex > 0 && (
              <Image
                alt="Icon previous arrow"
                className={style.course__arrowLeft}
                onClick={onPrev}
                path="icons/arrow-left-dDv8ZNZLEXDLXMTIprH2prZLYzGDAJ.png"
              />
            )}
            <Speech
              audioUrl={sentence?.audioUrl || ''}
              canNext={pronunciation}
              onCheck={onSpeechFeedback}
              onPlaySpeech={onPlaySpeech}
              word={sentence?.englishWord || ''}
            />
            {isSavingProgress || sentence?.isCompleted || isAdmin(user) ? (
              <Image
                alt="Icon next arrow"
                className={style.course__arrowRight}
                onClick={onNext}
                path="icons/arrow-right-yDOCuGraKYfcypi4OTVS03VQOIdSzJ.png"
              />
            ) : null}
          </div>
        </div>
        <ModalCongratulation
          isDemo={isDemo}
          state={[canShowModal, setCanShowModal]}
        />
        <ModalWrongPronunciation
          state={[wrongPronunciationMessage, setWrongPronunciationMessage]}
        />
        <ModalRating
          state={[canShowModalRating, setCanShowModalRating]}
          course={course?.title || ''}
          lesson={lessionTitle}
        />
        {!isDemo && (
          <ModalTips />
        )}
      </section >
    </>
  );
};

export default Course;
