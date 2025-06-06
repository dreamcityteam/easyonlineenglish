import React, { useContext, useEffect, useRef, useState } from 'react';
import { Lesson } from '../../../../global/state/type';
import SVGCheck from '../../../../../public/svg/check.svg';
import SVGCircle from '../../../../../public/svg/circle.svg';
import SVGCircleAlert from '../../../../../public/svg/circleAlert.svg';
import style from './style.module.sass';
import courseStyle from '../style.module.sass';
import speechStyle from '../../../../components/Speech/style.module.sass';
import Joyride from 'react-joyride';
import { Cookie, send } from '../../../../tools/function';
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

const elements: HTMLLIElement[] = [];

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
    const { step, action } = data;
    const element: HTMLLIElement = document.querySelector(step.target);

    if (element && step.target !== '#tidio-chat-iframe') {
      element.style.cssText = 'position: relative; z-index: 2;';

      elements.push(element);
    }

    if (action === 'reset') {
      elements.forEach((element) => element.removeAttribute('style'));
      Cookie.set(TUTORIAL, 'true');
      await send({ api: 'tutorial' }).patch();
    }

    if (['finished', 'skipped'].includes(data.status)) {
      setRun(false);
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
        spotlightClicks={true}
        steps={[
          {
            target: `.${style.aside__button}`,
            content:
              (
                <div className={style.tutorial__title}>
                  <header>
                    <h2>Menú de navegación</h2>
                  </header>
                  <p>
                    Aquí podrás ver cuantas lecciones has hecho en el curso.
                  </p>
                </div>
              ),
            disableBeacon: true,
            disableScrolling: true,
          },
          {
            target: `.${courseStyle.course__englishWord}`,
            content:
              (
                <div className={style.tutorial__title}>
                  <header>
                    <h2>Palabra Objetivo</h2>
                  </header>
                  <p>
                    Esta es la palabra que vas a aprender. Puedes darle "clic" las veces que quieras para practicarla.
                  </p>
                </div>
              ),
            disableBeacon: true,
            disableScrolling: true,

          },
          {
            target: `.${courseStyle.course__spanishTranslation}`,
            content:
              (
                <div className={style.tutorial__title}>
                  <header>
                    <h2>Palabra Objectivo en Español</h2>
                  </header>
                  <p>
                    Aquí verás el o los distintos significados en español de la palabra objetivo.
                  </p>
                </div>
              ),
            disableBeacon: true,
            disableScrolling: true,

          },
          {
            target: `.${courseStyle.course__progress}`,
            content:
              (
                <div className={style.tutorial__title}>
                  <header>
                    <h2>Barra de Progreso</h2>
                  </header>
                  <p>
                    Esta barra te indicará cuanto has avanzado en la palabra objetivo.                </p>
                </div>
              ),
            disableBeacon: true,
            disableScrolling: true,

          },
          {
            target: '.english_word',
            content:
              (
                <div className={style.tutorial__title}>
                  <header>
                    <h2>Frase u Oración</h2>
                  </header>
                  <p>
                    Aquí podrás practicar la palabra objetivo en una frase u oración. Dale "clic" y la escucharás las veces que quieras. Este audio tiene dos velocidades de reproducción, una lenta y una más rápida.
                  </p>
                </div>
              ),
            disableBeacon: true
          },

          {
            target: `.${courseStyle.course__content_text} .${courseStyle.course__feedback}`,
            content:
              (
                <div className={style.tutorial__title}>
                  <header>
                    <h2>Frase u Oración Práctica en Español</h2>
                  </header>
                  <p>
                    Esta imagen te ayudará a intepretar y entender en contexto la frase u oración que está practicando.
                  </p>
                </div>
              ),
            disableBeacon: true
          },
          {
            target: `.${courseStyle.course__content_text}:last-child > div`,
            content:
              (
                <div className={style.tutorial__title}>
                  <header>
                    <h2>Frase u Oración Práctica en Español</h2>
                  </header>
                  <p>
                    Aquí te presentamos la frase u oración en español para un mejor entendimiento.
                  </p>
                </div>
              ),
            disableBeacon: true
          },
          {
            target: `.${courseStyle.course__feedback} img`,
            content:
              (
                <div className={style.tutorial__title}>
                  <header>
                    <h2>Imagen Referencial</h2>
                  </header>
                  <p>
                    Esta imagen te ayudará a interpretar y entender en contexto la frase u oración que estás practicando.
                  </p>
                </div>
              ),
            disableBeacon: true
          },
          {
            target: `.${courseStyle.course__arrow}`,
            content: (
              <div className={style.tutorial__title}>
                <header>
                  <h2>Botón de Regreso</h2>
                </header>
                <p>
                  Te permite ir hacia atrás en el curso.
                </p>
              </div>
            ),
            disableBeacon: true
          },
          {
            target: `.${courseStyle.course__arrow}:last-child`,
            content: (
              <div className={style.tutorial__title}>
                <header>
                  <h2>Botón de Avance</h2>
                </header>
                <p>
                  Te permite continuar a la siguiente práctica.
                </p>
              </div>
            ),
            disableBeacon: true
          },
          {
            target: `.${speechStyle.speech}`,
            content: (
              <div className={style.tutorial__title}>
                <header>
                  <h2>Botón para escuchar y repetir</h2>
                </header>
                <p>
                  Al presionar este botón escucharás el audio del texto y repetirás lo que escuchaste después del sonido.
                </p>
              </div>
            ),
            disableBeacon: true
          },
          {
            target: '#tidio-chat-iframe',
            content: (
              <div className={style.tutorial__title}>
                <header>
                  <h2>Servicio al Estudiante</h2>
                </header>
                <p>
                  Al presionar este botón te podrás poner en contacto con nuestro equipo de atención al cliente. Recibirás una respuesta en un lapso no mayor de 24 horas.
                </p>
              </div>
            ),
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
          buttonClose: {
            display: 'none',
          },
          overlay: {
            backgroundColor: 'white',
            height: 'calc(103px + 100%)',
            zIndex: 1,
          },
          options: {
            primaryColor: '#0c97d6',
            textColor: '#5dade2',
            zIndex: 1,
          },
        }}
      />

      <button
        className={style.tutorial__button}
        onClick={() => setRun(true)}
      >
        Tutorial
      </button>

      <div className={style.button__container}>
        <div
          className={`${style.aside__button} ${canOpenSideBar ? style.aside__button_static : ''}`}
          onClick={toggleSidebar}
        >
          <Image
            path="icons/menu-Tl5hunSmTrcEE3CgnlTsnDMZEzzqTu.png"
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
              style={{ backgroundColor: lessonIndex === indexLesson ? '#f3f3f3' : '' }}
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