import React, { useContext, useEffect, useState } from 'react';
import Table from '../../../components/Table';
import style from './style.module.sass';
import { SET_LIBRARY } from '../../../global/state/actionTypes';
import { getData } from '../../../tools/function';
import context from '../../../global/state/context';
import { LibraryCache, LibraryContent } from '../../../global/state/type';
import Speech from '../../../components/Speech';
import { Item } from './type';
import ErrorConnection from '../../../components/ErrorConnection';
import Sound from '../../../components/Sound';

const Library: React.FC = (): JSX.Element => {
  const [data, setData] = useState<LibraryCache>([]);
  const [content, setContent] = useState<LibraryContent[]>([]);
  const [tabIndex, setTabIndex] = useState<number>(0);
  const [{ libraryCache }, dispatch] = useContext(context);

  useEffect(() => {
    saveLibraryData();
  }, []);

  const saveLibraryCacheData = (library: LibraryCache) => {
    dispatch({ type: SET_LIBRARY, payload: { library } });
  }

  const saveLibraryData = async () => {
    if (libraryCache.length) {
      setData(libraryCache);
      setContent(libraryCache[tabIndex].content);
      return;
    }

    await getData({
      service: { method: 'get', endpoint: 'library' },
      modal: { dispatch, text: 'Cargando libreria' },
      success: (data): void => {
        setData(data);
        setContent(data[tabIndex].content);
        saveLibraryCacheData(data);
      }
    });
  }

  const handlerOnTab = (index: number): void => {
    setContent(data[index].content);
    setTabIndex(index);
  }

  return (
    <>
      {data.length ? (
        <section className={style.vocabularies}>
          <header className={style.vocabularies__header}>
            <h1>Librería</h1>
          </header>
          <div className={style.vocabularies__container}>
            <aside className={style.vocabularies__aside}>
              <ul className={style.vocabularies__tabs}>
                {data.map(({ name }: any, index: number): JSX.Element => (
                  <li
                    key={index}
                    onClick={() => handlerOnTab(index)}
                    className={`${style.vocabularies__tab} ${tabIndex === index ? style['vocabularies__tabFocus'] : ''}`}
                  >
                    <span className={style.vocabularies__section}>
                      {name}
                    </span>
                  </li>
                ))}
              </ul>
            </aside>
            <div className={style.vocabularies__table}>
              <Table
                data={content}
                style={style}
                custom={{
                  _id: { avoid: true },
                  englishWord: { value: 'Ingles' },
                  spanishTranslation: { value: 'Español' },
                  audioUrl: {
                    value: 'Audio',
                    render: (value: string, item: Item): JSX.Element =>
                      <Sound src={value} style={style} />
                  },
                  imageUrl: {
                    value: 'Referencia',
                    render: (value: string): JSX.Element => (
                      <div className={style.table__image_container}>
                        <img
                          alt="vocabulary image"
                          className={style.table__image}
                          loading="lazy"
                          src={value}
                        />
                      </div>
                    )
                  },
                }}
              />
            </div>
          </div>
        </section>
      ) : <ErrorConnection />}
    </>
  );
}

export default Library;

