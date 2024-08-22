import React, { useCallback, useContext, useMemo, useRef, useState } from 'react';
import style from './style.module.sass';
import Modal from '../../../../components/Modal';
import { send } from '../../../../tools/function';
import context from '../../../../global/state/context';
import Loading from '../../../../components/Form/Loading';

interface Props {
  course: string;
  lesson: string;
  state: [boolean, any];
}

const ModalRating: React.FC<Props> = ({ state, course, lesson }): JSX.Element => {
  const [rating, setRating] = useState<number>(0);
  const stats = useMemo(() => [...Array(5)], []);
  const refs = useRef(stats.map(() => React.createRef<HTMLLIElement>()));
  const [{ user }] = useContext(context);
  const [canShow, setCanShow] = state;
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onHover: (index: number) => void = useCallback(
    (index: number) => {
      updateColor('add', index);
    },
    [rating]
  );

  const unHover: () => void = useCallback(() => {
    if (rating === 0) {
      updateColor('remove', stats.length);
    } else {
      updateColor('add', rating);
    }
  }, [rating]);

  const onClick: (index: number) => void = useCallback(
    (index: number) => {
      setRating(index);
      updateColor('add', index);
    },
    [rating]
  );

  const updateColor = (type: 'remove' | 'add', len: number): void => {
    refs.current.forEach((ref, index) => {
      if (ref.current) {
        ref.current.children[0].classList.toggle(style['stats__container--hover'], type === 'add' && index < len);
      }
    });
  };

  const formatLesson = (lesson: string): string => {
    const [, number]: string[] = lesson.split(' ');

    return `Lección ${number}`;
  }

  const onSend = async (): Promise<void> => {
    setIsLoading(true);

    await send({
      api: 'student-rating',
      data: {
        email: user.email,
        name: user.name,
        lastname: user.lastname,
        rating,
        course,
        lesson: formatLesson(lesson)
      }
    }).post();

    setIsLoading(false);
    setCanShow(false);
  }

  return (
    <Modal state={state} isFadeIn>
      <div className={style.stats}>
        <header className={style.stats__header}>
          <h2>¿Cómo calificarías tu experiencia hasta ahora?</h2>
        </header>
        <ul className={style.stats__container}>
          {stats.map((_, index) => (
            <li
              className={style.stats__number}
              key={index}
              onMouseOver={() => onHover(index + 1)}
              onMouseOut={unHover}
              onClick={() => onClick(index + 1)}
              ref={refs.current[index]}
              role="button"
              aria-label={`Rate ${index + 1} stars`}
              tabIndex={0}
            >
              <svg
                fill="#9e9e9e"
                strokeWidth="0"
                stroke="#27b3e4"
                viewBox="0 0 576 512"
                width="80px"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z">
                </path>
              </svg>
            </li>
          ))}
        </ul>
        {isLoading ? (
          <Loading color="#27b3e4" />
        ) : (
          <button
            className={style.stats__button}
            onClick={onSend}
          >
            enviar
          </button>
        )}
      </div>
    </Modal>
  );
};

export default ModalRating;
