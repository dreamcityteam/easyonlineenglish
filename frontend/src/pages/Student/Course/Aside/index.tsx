import React, { useContext, useEffect, useRef, useState } from 'react';
import { Lesson } from '../../../../global/state/type';
import SVGCheck from '../../../../../public/svg/check.svg';
import SVGCircle from '../../../../../public/svg/circle.svg';
import SVGCircleAlert from '../../../../../public/svg/circleAlert.svg';
import style from './style.module.sass';
import courseStyle from '../style.module.sass';
import speechStyle from '../../../../components/Speech/style.module.sass';
import Joyride from 'react-joyride';
import { Cookie, send, Storage } from '../../../../tools/function';
import { TUTORIAL } from '../../../../tools/constant';
import context from '../../../../global/state/context';
import Image from '../../../../components/Image';

interface Props {
  onClick: ({ word, wordIndex, indexLesson }: any) => void;
  title: string;
  completedWords: { [key: string]: boolean; };
  lessons: Lesson[];
  currentWord: { lesson: number; word: number; }
  isTutorial: boolean;
  lessonIndex: number;
};

const Aside: React.FC<Props> = ({
  onClick,
  title,
  completedWords,
  lessons,
  currentWord,
  isTutorial,
  lessonIndex
}): JSX.Element => {
  const [canOpenSideBar, setcanOpenSideBar] = useState<boolean>(false);
  const [sideBarClassName, setSideBarClassName] = useState<string>(style.hide__default);
  const currentLessonRef = useRef<HTMLLIElement | any>(null);
  const currentFocusWordRef = useRef<HTMLLIElement | any>(null);
  const currentFocusLessonRef = useRef<HTMLLIElement | any>(null);
  const [run, setRun] = useState<boolean>(isTutorial);
  const [spotlightWidth, setSpotlightWidth] = useState<string>('');
  const [{ user }] = useContext(context);

  useEffect(() => {
    if (user === null && Cookie.get(TUTORIAL)) {
      setRun(false);
    } else if (user) {
      setRun(user?.isTutorial);
    }
  }, []);

  const toggleSidebar = (): void => {
    const canOpen: boolean = !canOpenSideBar;

    setcanOpenSideBar(canOpen);
    setSideBarClassName(canOpen ? style.display : style.hide);

    if (canOpen) {
      if (!currentFocusLessonRef.current?.nextSibling.classList.contains(style.word__display)) {
        toggleLessonWords({ target: currentFocusLessonRef.current });
      }
      currentFocusWordRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }

  const toggleLessonWords = ({ target }: any): void => {
    if (target.classList.contains(style.aside__lession_title)) {
      const isLastLesson: boolean = currentLessonRef.current !== target.nextSibling;

      target.nextSibling.classList.toggle(style.word__display);

      if (isLastLesson) {
        currentLessonRef.current?.classList.remove(style.word__display);
      }

      if (currentLessonRef.current === null || isLastLesson) {
        currentLessonRef.current = target.nextSibling;
      }
    }
  };

  const handleStepChange = async (data: any): Promise<void> => {
    if (data.index === 3) {
      setSpotlightWidth('205px');
    } else {
      setSpotlightWidth('');
    }

    if (data.action === 'reset') {
      Cookie.set(TUTORIAL, 'true');
      await send({ api: 'tutorial' }).patch();
    }
  };

  return (
    <aside className={`${style.aside} ${sideBarClassName}`}>
      <Joyride
        continuous
        run={run}
        scrollToFirstStep
        showProgress
        showSkipButton
        callback={handleStepChange}
        steps={[
          {
            target: `.${style.aside__button}`,
            content: <h2 className={style.tutorial__title}>Aquí puedes desplegar el menú de navegación del curso.</h2>,
            disableBeacon: true,
            disableScrolling: true,
          },
          {
            target: `.${courseStyle.course__englishWord}`,
            content: <h2 className={style.tutorial__title}>Aquí podrás ver la palabra en inglés. Si haces clic en la palabra, podrás escuchar su pronunciación a dos velocidades distintas.</h2>,
            disableBeacon: true,
            disableScrolling: true,

          },
          {
            target: `.${courseStyle.course__spanishTranslation}`,
            content: <h2 className={style.tutorial__title}>Aquí podrás leer la traducción al español de la palabra en inglés.</h2>,
            disableBeacon: true,
            disableScrolling: true,

          },
          {
            target: `.${courseStyle.course__content_text} .${courseStyle.course__text_grandient}`,
            content: <h2 className={style.tutorial__title}>Aquí podrás leer la frase u oración en inglés. Si haces clic, podrás escuchar su pronunciación a dos velocidades distintas.</h2>,
            disableBeacon: true
          },
          {
            target: `.${speechStyle.speech}`,
            content: <h2 className={style.tutorial__title}>Aquí podrás escuchar la oración o frase en inglés y, cuando escuches un sonido, tendrás que pronunciarla.</h2>,
            disableBeacon: true
          }
        ]}
        locale={{
          back: 'Regresar',
          close: 'Cerrar',
          last: 'Finalizar',
          next: 'Siguiente',
          skip: 'Saltar'
        }}
        styles={{
          spotlight: {
            maxWidth: spotlightWidth,
          },
          buttonClose: {
            display: 'none',
          },
          overlay: {
            height: 'calc(103px + 100%)',
            zIndex: 4,
          },
          options: {
            primaryColor: '#0c97d6',
            textColor: '#5dade2',
            zIndex: 1,
          },
        }}
      />
      <div className={style.button__container}>
        <div
          className={`${style.aside__button} ${canOpenSideBar ? style.aside__button_static : ''}`}
          onClick={toggleSidebar}
        >
          <Image
            path="icons/menu-kSzFtbNmdC6Wmt8VUxbjoEfsENhcf4.avif"
            alt="Aside button"
          />
        </div>
      </div>
      <div className={style.aside__title}>
        <h1>{title}</h1>
      </div>
      <ul className={style.aside__lessions}>
        {lessons.map((lesson: Lesson, indexLesson: number) => (
          <li
            className={style.aside__lession}
            key={indexLesson}
            onClick={toggleLessonWords}
          >
            <span
              ref={indexLesson === currentWord.lesson ? currentFocusLessonRef : null}
              className={style.aside__lession_title}
              style={{ backgroundColor: lessonIndex === indexLesson ? '#f3f3f3' : ''}}
            >
              {lesson?.title}
            </span>
            <ul
              className={style.aside__words}
            >
              {lesson?.words.map((word: any, wordIndex: number) => (
                <li
                  className={style.aside__word}
                  key={wordIndex}
                  onClick={() => onClick({ word, wordIndex, indexLesson })}
                  ref={(
                    (indexLesson === currentWord.lesson) &&
                    (wordIndex === currentWord.word)
                  ) ? currentFocusWordRef : null}
                >
                  <div className={style.aside__element}>
                    {completedWords[word._id] ? (
                      <img
                        alt="Circle"
                        className={style.aside__padlock}
                        src={SVGCheck}
                      />
                    ) : (
                      (indexLesson === currentWord.lesson) &&
                      (wordIndex === currentWord.word)
                    ) ? (
                      <img
                        alt="Circle exclamation"
                        className={style.aside__padlock}
                        src={SVGCircleAlert}
                      />
                    ) : (
                      <img
                        alt="Circle checked"
                        className={style.aside__padlock}
                        src={SVGCircle}
                      />
                    )
                    }
                    <span>{word.englishWord}</span>
                  </div>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </aside>
  )
};

export default Aside;