import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Course as TCourse,
  Lesson,
  Sentence,
  Word
} from '../../../global/state/type';
import Aside from './Aside';
import Speech from '../../../components/Speech';
import InlineEditor from '../../../components/InlineEditor';
import style from './style.module.sass';
import { CourseProgress, OnWord, WordSplitType } from './types';
import {
  formatWord,
  getClassName,
  getData,
  getFeedbackMessage,
  isAdmin,
  removeAccents,
  send,
  getDomainBasedOnEnvironment,
  isDev
} from '../../../tools/function';
import { CLEAR_LOAD, SET_COURSE_CACHE, SET_LOAD } from '../../../global/state/actionTypes';
import context from '../../../global/state/context';
import { HTTP_STATUS_CODES } from '../../../tools/constant';
import { Response } from '../../../tools/type';
import pronunciation from './pronunciation.json';
import ModalWrongPronunciation from './ModalWrongPronunciation';
import ModalCongratulation from './ModalCongratulation';
import ImageComponent from '../../../components/Image';
import Head from './Head';
import ModalRating from './ModalRating';
import ImageLazy from '../../../components/ImageLazy';
import Sound from '../../../components/Sound';
import Exercise from './Exercise';

interface Props {
  isDemo?: boolean;
};

const loadingSettings = { type: SET_LOAD, payload: { text: 'Cargando curso', canShow: true } };

const Course: React.FC<Props> = ({ isDemo = false }): JSX.Element => {
  const { idCourse } = useParams<string>();
  const [{ courseCache, user }, dispatch] = useContext(context);

  // Debug logging at component start (development only)
  if (isDev()) {
    console.log('=== COURSE COMPONENT LOADED ===');
    console.log('User object:', user);
    console.log('User role:', user?.role);
    console.log('isAdmin result:', isAdmin(user));
  }
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
  const [countPronunciation, setCountPronunciation] = useState<number>(1);
  const [wrongPronunciationMessage, setWrongPronunciationMessage] = useState<boolean>(false);
  const [isCorrectPronuciation, setIsCorrectPronunciation] = useState<boolean>(false);
  const [pronunciationFeedback, setPronunciationFeedback] = useState<string>('');
  const [canShowModalRating, setCanShowModalRating] = useState<boolean>(false);
  const [showExplanationModal, setShowExplanationModal] = useState<boolean>(false);
  const [currentExplanation, setCurrentExplanation] = useState<any>(null);

  useEffect(() => {
    saveCourseData();
  }, []);

  useEffect(() => {
    if (courseCache[idCache]) {
      dispatch({ type: CLEAR_LOAD });
    } else {
      dispatch(loadingSettings);
    }
  }, [user, courseCache]);

  const saveCourseCacheData = (course: TCourse): void =>
    dispatch({ type: SET_COURSE_CACHE, payload: { ...course, idCourse: idCache } });

  const saveCourseData = async (): Promise<void> => {
    const cache: TCourse = courseCache[idCache];

    if (cache) {
      setCourseData(cache);
      return;
    }

    await getData({
      modal: { dispatch, text: loadingSettings.payload.text },
      service: {
        method: 'get',
        endpoint: isDemo ? 'student-course-demo' : `student-course/${idCourse}`
      },
      success: ({ words, exercises, ...data }): void => {
        const course = { ...data, lessons: formatLessons(words, exercises) };

        setCourseData(course);
        saveCourseCacheData(course);
      }
    });
  };

  const formatLessons = (words: Word[], exercises: Word[]): Lesson[] => {
    type Lessons = { title: string; words: Word[]; };
    const getLessonData = (title: number): Lessons => ({ title: `Lección ${title}`, words: [] as Word[] });

    // Agrupar palabras por su "memoria" (lessonNumber)
    const lessonsMap: Map<number, Word[]> = new Map();

    words.forEach((word: Word) => {
      // Cada palabra "recuerda" a qué lección pertenece
      const lessonNum = (word as any).lessonNumber || 1;

      if (!lessonsMap.has(lessonNum)) {
        lessonsMap.set(lessonNum, [] as Word[]);
      }

      const lessonWords = lessonsMap.get(lessonNum)!;
      lessonWords.push(word);
    });

    // Convertir a array de lecciones ordenadas
    const lessons: Lessons[] = [];
    const sortedLessonNumbers = Array.from(lessonsMap.keys()).sort((a, b) => a - b);
    let exerciseIndex = 0;

    sortedLessonNumbers.forEach((lessonNumber) => {
      const lessonWords: Word[] = lessonsMap.get(lessonNumber) || [];

      lessonWords.sort((a, b) => {
        const orderA = (a as any).orderInLesson || 0;
        const orderB = (b as any).orderInLesson || 0;
        return orderA - orderB;
      });

      const lesson = getLessonData(lessonNumber);
      lesson.words = [...lessonWords];

      if (exercises && exercises[exerciseIndex]) {
        lesson.words.push(exercises[exerciseIndex]);
        exerciseIndex++;
      }

      lessons.push(lesson);
    });

    return lessons;
  };

  const setCourseData = (course: TCourse): void => {
    let indexLesson: number = course.index.lesson;
    let indexWord: number = course.index.word;
    let sentenceIndex: number = 0;

    if (course.lessons.length === 1) {
      const wordCompletedLength: number = Object.keys(course.completedWords).length;

      indexLesson = 0;
      indexWord = wordCompletedLength < 10 ? wordCompletedLength : 9;
    }

    const currentLession: Lesson = course.lessons[indexLesson];
    let currentWord: Word = currentLession.words[indexWord];

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
    setLessonIndex(indexLesson);
    setWordIndex(indexWord);
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

    if (
      course &&
      (
        !course?.completedWords[newWord._id] &&
        course.index.sentence > 0 &&
        !canTakeNextWord
      )
    ) {
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
    canClickOnPrevButton() && update(sentenceIndex - 1);
  }

  const canClickOnNextButton = (): boolean =>
    isSavingProgress || !!sentence?.isCompleted || isAdmin(user);

  const canClickOnPrevButton = (): boolean =>
    sentenceIndex > 0;

  const disableButton = (canClick: boolean): { [key: string]: any; } => ({
    opacity: canClick ? 1 : 0.5,
    transition: 'opacity 1s ease'
  });

  const handleLearnMore = (): void => {
    if (word?.expandedExplanation) {
      setCurrentExplanation({
        word: word.englishWord,
        ...word.expandedExplanation
      });
      setShowExplanationModal(true);
    }
  };

  const onNext = (): void => {
    if (!canClickOnNextButton()) return;

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
        ? isSkip ? '¡Practica más, lo lograrás!' : getFeedbackMessage().correct
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
        api: 'student-sentence',
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

  // Function to update sentence fields
  const updateSentenceField = async (field: 'englishWord' | 'spanishTranslation', newValue: string): Promise<void> => {
    if (!word || !sentence) {
      return;
    }

    try {
      const updateData = {
        wordId: word._id,
        sentenceIndex: sentenceIndex,
        [field]: newValue
      };

      // Log for debugging (only in development)
      if (isDev()) {
        console.log('Attempting to update sentence:', {
          api: 'update-sentence',
          data: updateData,
          fullUrl: `${getDomainBasedOnEnvironment()}/api/v1/update-sentence`
        });
      }

      const response = await send({
        api: 'update-sentence',
        data: updateData
      }).put();

      if (response?.response?.statusCode === HTTP_STATUS_CODES.OK) {

        // Update local state
        setSentence(prev => prev ? { ...prev, [field]: newValue } : prev);

        // Update word state
        setWord(prev => {
          if (!prev) return prev;
          const updatedSentences = [...prev.sentences];
          updatedSentences[sentenceIndex] = { ...updatedSentences[sentenceIndex], [field]: newValue };
          return { ...prev, sentences: updatedSentences };
        });
      } else {
        throw new Error(`Server error: ${response?.response?.statusCode || 'Unknown'}`);
      }
    } catch (error) {
      console.error('Error updating sentence:', error);
      throw error;
    }
  };

  const AudioWord = (type: 'englishWord' | 'letter'): JSX.Element | null => {
    // Handles playing audio when a URL is provided
    const playAudio = (url: string) => {
      if (!url) return;
      const audio: HTMLAudioElement = new Audio(url);
      audio.play().catch((error) => {
        console.error('Failed to play audio:', error);
      });
    };

    // Renders a clickable span that plays audio
    const WordSplit: React.FC<WordSplitType> = ({
      url,
      text,
      hasQuotes = false,
      isHighlights = false
    }): JSX.Element => (
      <span
        style={{ cursor: 'pointer', borderBottom: isHighlights ? '2px solid red' : 'none' }}
        className={getClassName(style.course__text_grandient, style.course__textSentence)}
        onClick={() => playAudio(url)}
      >
        {hasQuotes ? `"${text}"` : text}
      </span>
    );

    if (type === 'letter' && word) {
      return (
        <WordSplit
          url={word.audioUrl}
          text={word.englishWord}
          hasQuotes
        />
      );
    }

    if (type === 'englishWord' && sentence) {
      const { audioSplitUrls = [], englishWord = '', audioUrl = '', audioSlowUrl = '' } = sentence;
      const splitTexts: string[] = englishWord.split(' ');
      const shouldPlaySingleAudio: boolean = audioSplitUrls.length === 0;
      const pronunciations: string[] = pronunciationFeedback.toLowerCase().split(' ');

      // If admin, show inline editor for englishWord
      if (isAdmin(user)) {
        return (
          <div>
            <div className="english_word">
              <InlineEditor
                value={englishWord}
                onSave={(newValue) => updateSentenceField('englishWord', newValue)}
                placeholder="English word..."
                className={getClassName(style.course__text_grandient, style.course__textSentence)}
              />
            </div>
            {audioSplitUrls.length > 0 && (
              <div className={style.course__audio}>
                <span
                  className={style.course__text_language}
                >
                  Inglés
                </span>
                <Sound
                  slowAudioUrl={audioSlowUrl}
                  src={audioUrl}
                  style={style}
                  stop={isPlaySpeech}
                />
              </div>
            )}
          </div>
        );
      }

      return (
        <div onClick={shouldPlaySingleAudio ? () => playAudio(audioUrl) : undefined}>
          <div className="english_word">
            {
              splitTexts.map((text: string, index: number): JSX.Element => {
                let isMismatch: boolean = pronunciations.includes(removeAccents(formatWord(text)));

                return (
                  <React.Fragment key={index}>
                    {WordSplit({
                      url: audioSplitUrls[index],
                      text: `${text} `,
                      isHighlights: !(!feedback.canShow || isCorrectPronuciation) && !isMismatch
                    })}
                  </React.Fragment>
                )
              })
            }
          </div>
          {audioSplitUrls.length > 0 && (
            <div className={style.course__audio}>
              <span
                className={style.course__text_language}
              >
                Inglés
              </span>
              <Sound
                slowAudioUrl={audioSlowUrl}
                src={audioUrl}
                style={style}
                stop={isPlaySpeech}
              />
            </div>
          )}
        </div>
      );
    }

    return null;
  };

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
                className={
                  getClassName(
                    style.course__text_grandient,
                    style.course__text_lession
                  )
                }
              >
                {lessionTitle}
              </span>
            </div>
            <div className={style.course__englishWord}>
              {AudioWord('letter')}
            </div>
            <div className={style.course__spanishTranslation_container}>
              <span
                className={
                  getClassName(
                    style.course__text_grandient,
                    style.course__spanishTranslation
                  )
                }
              >
                {word?.spanishTranslation}
              </span>
            </div>

            {/* Botón "Haz click y aprende más" */}
            {word?.expandedExplanation?.isActive && (
              <div style={{ textAlign: 'center', margin: '10px 0' }}>
                <button
                  onClick={handleLearnMore}
                  style={{
                    backgroundColor: 'transparent',
                    border: '1px solid #ccc',
                    borderRadius: '20px',
                    padding: '8px 16px',
                    fontSize: '14px',
                    color: '#666',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = '#f0f0f0';
                    e.currentTarget.style.borderColor = '#999';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.borderColor = '#ccc';
                  }}
                >
                  🔍 Haz click y aprende más
                </button>
              </div>
            )}
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

          {word?.type === 'word' && (
            <>
              <div className={style.course__content_container}>
                <div className={style.course__content}>
                  <div className={`${style.course__content_text}`}>
                    {AudioWord('englishWord')}
                    {sentence?.audioSplitUrls?.length === 0 && (
                      <span
                        className={style.course__text_language}
                      >
                        Inglés
                      </span>
                    )}
                  </div>
                  <div className={style.course__feedback}>
                    <ImageLazy
                      alt={sentence?.englishWord}
                      className={style.course__image}
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
                      {isAdmin(user) ? (
                          <InlineEditor
                            value={sentence?.spanishTranslation || ''}
                            onSave={(newValue) => updateSentenceField('spanishTranslation', newValue)}
                            placeholder="Spanish translation..."
                            className={getClassName(
                              style.course__text_grandient,
                              style.course__textSentence
                            )}
                          />
                        ) : (
                          <span className={
                            getClassName(
                              style.course__text_grandient,
                              style.course__textSentence
                            )
                          }>
                            {sentence?.spanishTranslation}
                          </span>
                        )}
                    </div>
                    <span className={style.course__text_language}>
                      Español
                    </span>
                  </div>
                </div>
              </div>
              <div className={style.course__pronunciation}>
                <div className={style.course__button}>
                  <ImageComponent
                    alt="Icon previous arrow"
                    className={style.course__arrow}
                    onClick={onPrev}
                    path="icons/arrow-left-dDv8ZNZLEXDLXMTIprH2prZLYzGDAJ.png"
                    style={disableButton(canClickOnPrevButton())}
                  />
                  <div className={style.course__speech}>
                    <Speech
                      audioUrl={sentence?.audioUrl || ''}
                      canNext={pronunciation}
                      onCheck={onSpeechFeedback}
                      onPlaySpeech={onPlaySpeech}
                      word={sentence?.englishWord || ''}
                    />
                  </div>
                  <ImageComponent
                    alt="Icon next arrow"
                    className={style.course__arrow}
                    onClick={onNext}
                    path="icons/arrow-right-yDOCuGraKYfcypi4OTVS03VQOIdSzJ.png"
                    style={disableButton(canClickOnNextButton())}
                  />
                </div>
              </div>
            </>
          )}
          {word?.type === 'exercise' && (
            <Exercise
              onPlaySpeech={onPlaySpeech}
              sentenceIndex={sentenceIndex}
              feedback={feedback}
              word={word}
              onNext={() => {
                skipWord();
                onNext();
              }}
            />
          )}
        </div>
        {/* Modal de Explicación Expandible */}
        {showExplanationModal && currentExplanation && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1000
            }}
            onClick={() => setShowExplanationModal(false)}
          >
            <div
              style={{
                backgroundColor: 'white',
                borderRadius: '15px',
                padding: '30px',
                maxWidth: '500px',
                maxHeight: '80vh',
                overflow: 'auto',
                margin: '20px',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
                animation: 'modalFadeIn 0.3s ease-out'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <h2 style={{
                  color: '#2c3e50',
                  margin: '0 0 10px 0',
                  fontSize: '24px'
                }}>
                  ✨ APRENDE MÁS SOBRE
                </h2>
                <h3 style={{
                  color: '#3498db',
                  margin: '0',
                  fontSize: '28px',
                  fontWeight: 'bold'
                }}>
                  "{currentExplanation.word?.toUpperCase()}"
                </h3>
              </div>

              {currentExplanation.description && (
                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{
                    color: '#34495e',
                    fontSize: '16px',
                    marginBottom: '10px',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    📝 DESCRIPCIÓN:
                  </h4>
                  <p style={{
                    color: '#2c3e50',
                    lineHeight: '1.6',
                    margin: '0',
                    fontSize: '15px'
                  }}>
                    {currentExplanation.description}
                  </p>
                </div>
              )}

              {currentExplanation.usageNotes && currentExplanation.usageNotes.length > 0 && (
                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{
                    color: '#34495e',
                    fontSize: '16px',
                    marginBottom: '10px',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    💡 NOTAS DE USO:
                  </h4>
                  <ul style={{
                    color: '#2c3e50',
                    lineHeight: '1.6',
                    margin: '0',
                    paddingLeft: '20px',
                    fontSize: '15px'
                  }}>
                    {currentExplanation.usageNotes.map((note: string, index: number) => (
                      <li key={index} style={{ marginBottom: '6px' }}>{note}</li>
                    ))}
                  </ul>
                </div>
              )}

              {currentExplanation.additionalExamples && currentExplanation.additionalExamples.length > 0 && (
                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{
                    color: '#34495e',
                    fontSize: '16px',
                    marginBottom: '10px',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    📚 EJEMPLOS ADICIONALES:
                  </h4>
                  {currentExplanation.additionalExamples.map((example: any, index: number) => (
                    <div key={index} style={{
                      marginBottom: '12px',
                      padding: '12px',
                      backgroundColor: '#f8f9fa',
                      borderRadius: '8px',
                      borderLeft: '4px solid #3498db'
                    }}>
                      <div style={{
                        color: '#2c3e50',
                        fontWeight: '600',
                        marginBottom: '4px',
                        fontSize: '15px'
                      }}>
                        • "{example.english}"
                      </div>
                      <div style={{
                        color: '#7f8c8d',
                        fontSize: '14px',
                        marginLeft: '12px',
                        marginBottom: '4px'
                      }}>
                        → "{example.spanish}"
                      </div>
                      {example.context && (
                        <div style={{
                          color: '#95a5a6',
                          fontSize: '13px',
                          marginLeft: '12px',
                          fontStyle: 'italic'
                        }}>
                          ({example.context})
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <div style={{ textAlign: 'center', marginTop: '25px' }}>
                <button
                  onClick={() => setShowExplanationModal(false)}
                  style={{
                    backgroundColor: '#3498db',
                    color: 'white',
                    border: 'none',
                    borderRadius: '25px',
                    padding: '12px 24px',
                    fontSize: '16px',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s ease',
                    fontWeight: '500'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = '#2980b9';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = '#3498db';
                  }}
                >
                  ✓ Entendido
                </button>
              </div>
            </div>
          </div>
        )}

        <ModalCongratulation
          isDemo={isDemo}
          state={[canShowModal, setCanShowModal]}
        />
        <ModalWrongPronunciation
          state={[wrongPronunciationMessage, setWrongPronunciationMessage]}
        />
        <ModalRating
          state={[canShowModalRating, setCanShowModalRating]}
          course={course?.title}
          lesson={lessionTitle}
        />
      </section >
    </>
  );
};

export default Course;
