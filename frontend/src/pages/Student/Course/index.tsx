import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Course as TCourse, Lesson, Sentence, Word } from '../../../global/state/type';
import Aside from './Aside';
import Speech from '../../../components/Speech';
import SVGArrowLeft from '../../../../public/svg/arrowLeft.svg';
import SVGArrowRight from '../../../../public/svg/arrowRight.svg';
import style from './style.module.sass';
import Modal from '../../../components/Modal';
import Confetti from '../../../components/Confetti';
import { CourseProgress, OnWord } from './types';
import { getData, send } from '../../../tools/function';
import { SET_COURSE_CACHE } from '../../../global/state/actionTypes';
import context from '../../../global/state/context';
import { HTTP_STATUS_CODES } from '../../../tools/constant';
import { Response } from '../../../tools/type';
import pronunciation from './pronunciation.json';
import ErrorConnection from '../../../components/ErrorConnection';
import { LESSIONS_COUNT } from './data';

interface Props {
  isDemo?: boolean;
}

const Course: React.FC<Props> = ({ isDemo = false }): JSX.Element => {
  const { idCourse } = useParams<string>();
  const [{ courseCache }, dispatch] = useContext(context);
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
  const [canSlowAudio, setCanSlowAudio] = useState<{ [key: string]: boolean; }>({
    word: false,
    sentence: false
  });

  useEffect(() => {
    saveCourseData();
  }, []);

  const disabledSlowAudio = (): void =>
    setCanSlowAudio({ word: false, sentence: false });

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
        const course = { ...data, lessons: formatLessons(words) }

        setCourseData(course);
        saveCourseCacheData(course);
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
    const cache: TCourse = courseCache[idCache];
    const sentenceIndex: number = cache ? cache.index.sentence || 0 : 0;
    let currentWord: Word = currentLession.words[course.index.word];

    if (course.completedWords[currentWord._id]) {
      currentWord = getWordSentenceCompleted(currentWord);
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

    if (course?.unlockedWords[word._id] || canTakeNextWord) {
      setWord(newWord);
      setSentence(newWord.sentences[sentenceIndex]);
      setLessionTitle(lessons[indexLesson].title);
      setLessonIndex(indexLesson);
      setWordIndex(wordIndex);
      setSentenceIndex(sentenceIndex);
      cleanFeedback();
    }

    disabledSlowAudio();
  };

  const getWordSentenceCompleted = (word: Word): Word => {
    const newState: Word = { ...word };

    newState.sentences = word.sentences.map(
      (sentence: Sentence): Sentence => ({ ...sentence, isCompleted: true, })
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
          currentState.index = { lesson: index.lesson, word: index.word };

          saveCourseCacheData(currentState);
          return currentState;
        });
      };

      if (course.unlockedWords[nextWord._id] && !isCourseCompleted) return onNextWord();

      const courseProgress: CourseProgress = {
        idStudentCourse: course.idStudentCourse,
        completedWords: isCourseCompleted ? nextWord._id : word._id,
        unlockedWords: nextWord._id,
        index: { lesson: nextLessonIndex, word: nextWordIndex },
        progress: course.progress
      };

      if (!isDemo) {
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
  };

  const onSpeechFeedback = (isCorrect: boolean): void => {
    setFeedback({
      message: isCorrect ? '¡Correcto!' : '¡Intente de nuevo!',
      canShow: true,
    });

    if (isCorrect && !word?.sentences[sentenceIndex]?.isCompleted) {
      saveCacheSentenceIndex();
      setWord((currentState: any) => {
        const newState = currentState;

        newState.sentences[sentenceIndex].isCompleted = true;

        return newState;
      });
    }
  };

  const saveCacheSentenceIndex = (): void => {
    if (course && word) {
      saveCourseCacheData({
        ...course,
        index: {
          ...course.index,
          sentence: sentenceIndex === word.sentences.length - 1 ? sentenceIndex : sentenceIndex + 1
        }
      });
    }
  }

  const onPlaySpeech = (isPlay: boolean): void => {
    isPlay && cleanFeedback();
    setPlaySpeech(isPlay);
    setCanDisabledAudio(isPlay);
  };

  const cleanFeedback = (): void =>
    setFeedback({ message: '', canShow: false });

  const getWordProgress = (): string => {
    const totalSentencesCount: number = word?.sentences?.length || 0;

    return `${totalSentencesCount === 0
      ? 0
      : Math.floor((getCompletedSentencesCount() / totalSentencesCount) * 100)}%`;
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

  const handlerOnPlayWord = (type: 'word' | 'sentence'): void => {
    const url: string | undefined = type === 'word' ? word?.audioUrl : sentence?.audioUrl;

    if (!url || canDisabledAudio) return;

    const audio: HTMLAudioElement = new Audio(url);

    audio.playbackRate = canSlowAudio[type] ? 0.8 : 1;
    audio.play();
    setCanSlowAudio((state) => ({ ...state, [type]: !canSlowAudio[type] }));
  };

  return (
    <>
      {course ? (
        <section className={style.course}>
          {course && (
            <Aside
              isTutorial={isDemo}
              lessons={lessons}
              currentWord={course.index}
              completedWords={course.completedWords}
              onClick={onWord}
              title={course.title}
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
                  onClick={() => handlerOnPlayWord('word')}
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
                  style={{ width: getWordProgress() }}
                ></div>
                <span>{getWordProgress()} completado</span>
                <span>
                  {getCompletedSentencesCount()} de{' '}
                  {word?.sentences.length}
                </span>
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
                      onClick={() => handlerOnPlayWord('sentence')}
                      className={style.course__text_grandient}
                    >
                      {sentence?.englishWord}
                    </span>
                  </div>
                  <span
                    className={style.course__text_language}
                  >
                    Inglés
                  </span>
                </div>
                <div className={style.course__feedback}>
                  <img
                    alt="Sentence"
                    className={style.course__image}
                    loading="lazy"
                    src={sentence?.imageUrl}
                  />
                  {feedback.canShow && (
                    <span
                      style={{ background: (feedback.message === '¡Correcto!') ? '#4caf50' : '#f44336' }}
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
                <img
                  alt="Previous arrow"
                  className={style.course__arrowLeft}
                  onClick={onPrev}
                  src={SVGArrowLeft}
                />
              )}
              <Speech
                word={sentence?.englishWord || ''}
                onCheck={onSpeechFeedback}
                audioUrl={sentence?.audioUrl || ''}
                onPlaySpeech={onPlaySpeech}
                canNext={pronunciation}
              />
              {isSavingProgress || sentence?.isCompleted && (
                <img
                  alt="Next arrow"
                  className={style.course__arrowRight}
                  onClick={onNext}
                  src={SVGArrowRight}
                />
              )}
            </div>
          </div>
          <Modal
            canShow={canShowModal}
            isFadeIn
          >
            <header>
              <h2> ¡Felicidades! </h2>
            </header>

            <div className={style.course__modal}>
              {isDemo ? (
                <p>¡Felicidades por completar el curso demo! Si estás listo para seguir adelante, ¡dale click al botón "Planes" y prepárate para más aprendizaje! Estoy aquí para ayudarte en tu viaje. ¡Adelante!</p>
              ) : (
                <p>¡Felicidades por completar el curso demo! Eso es un gran logro y demuestra tu compromiso con aprender y crecer.</p>
              )}

              <Link
                to={isDemo ? '/plan' : '/courses'}
                className={style.course__modalButton}
              >
                {isDemo ? 'planes' : 'Cursos'}
              </Link>
            </div>
            <Confetti />
          </Modal>
        </section>
      ) : (<ErrorConnection />)}
    </>
  );
};

export default Course;
