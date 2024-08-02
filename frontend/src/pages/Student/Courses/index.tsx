import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getData } from '../../../tools/function';
import { SET_COURSES_CACHE } from '../../../global/state/actionTypes';
import { Courses as TCourses } from '../../../global/state/type';
import context from '../../../global/state/context';
import style from './style.module.sass';

interface Props {
  isDemo?: boolean;
};

const Courses: React.FC<Props> = ({ isDemo = false }): JSX.Element => {
  const [courses, setCourses] = useState<TCourses[]>([]);
  const [{ coursesCache, courseCache }, dispatch] = useContext(context);
  const idCourseCache: 'demo' | 'courses' = isDemo ? 'demo' : 'courses';

  useEffect(() => {
    saveCourseData();
  }, []);

  const saveCoursesCacheData = (courses: TCourses[]): void =>
    dispatch({ type: SET_COURSES_CACHE, payload: { key: idCourseCache, value: courses } })

  const saveCourseData = async (): Promise<void> => {
    const cache: TCourses[] = coursesCache[idCourseCache];

    if (cache && cache.length) {
      setCourses(cache);
      return;
    }

    await getData({
      service: {
        method: 'get',
        endpoint: isDemo ? 'student-courses-demo' : 'courses'
      },
      modal: { dispatch, text: 'Cargando cursos' },
      success: (data): void => {
        setCourses(data);
        saveCoursesCacheData(data);
      }
    });
  }

  const getDemoCourseProgress = (key: string): number => {
    const course = courseCache[`${key}-demo`];

    if (course) {
      const progress: any = (Object.keys(course.completedWords).length / course.lessons[0].words.length) * 100;

      return Math.round(progress.toFixed(1));
    }

    return 0;
  }

  return (
    <>
      <section className={style.courses}>
        <header className={style.courses__header}>
          <h1>Cursos</h1>
        </header>
        <div className={style.courses__items}>
          {courses.map(({ _id, picture, title, description, progress = 0, isAvaliable = true }: TCourses, index: number): JSX.Element => {
            let _progress: number = courseCache[_id] ? courseCache[_id].progress : progress;

            _progress = isDemo ? getDemoCourseProgress(_id) : _progress;

            return (
              <article className={style.courses__container} key={index}>
                <img
                  className={style.courses__picture}
                  alt={title}
                  src={picture}
                />
                <div className={style.courses__background} />
                <div className={style.courses__progress}>
                  <div className={style.courses__progress_chart}>
                    <svg viewBox="0 0 36 36" className={style.courses__progress_circular_chart}>
                      <path className={style.courses__progress_circle_bg}
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path className={style.courses__progress_circle}
                        strokeDasharray={`${_progress}, 100`}
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <text x="18" y="20.35" className={style.courses__progress_percentage}>
                        {_progress}%
                      </text>
                    </svg>
                  </div>
                </div>

                <div className={style.courses__text}>
                  <p>{description}</p>
                </div>
                <div className={style.courses__title}>
                  <p>{isDemo ? '¡Prueba gratis! Las primeras 10 palabras.' : title}</p>
                </div>
                <Link
                  className={style.courses__button}
                  to={isAvaliable ? `/course/${_id}` : '#'}
                >
                  {isAvaliable ? '¡Comienza ya!' : '¡Muy pronto!'}
                </Link>
              </article>
            )
          })}
        </div>
      </section>
    </>
  );
};

export default Courses;
