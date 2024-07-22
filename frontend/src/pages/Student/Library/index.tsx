import React, { useContext, useEffect, useState } from 'react';
import Table from '../../../components/Table';
import style from './style.module.sass';
import { SET_LIBRARY } from '../../../global/state/actionTypes';
import { getData } from '../../../tools/function';
import context from '../../../global/state/context';
import { LibraryCache, LibraryContent } from '../../../global/state/type';
import Speech from '../../../components/Speech';
import { EnglishVerbConjugation, Item } from './type';
import Sound from '../../../components/Sound';
import verbs from './verbs.json'

const Library: React.FC = (): JSX.Element => {
  const [data, setData] = useState<LibraryCache>([]);
  const [content, setContent] = useState<LibraryContent[]>([]);
  const [tabIndex, setTabIndex] = useState<number>(0);
  const [{ libraryCache }, dispatch] = useContext(context);
  const [speech, setSpeech] = useState<{ [key: string]: boolean; }>({});

  useEffect(() => {
    saveLibraryData();
  }, []);

  const saveLibraryCacheData = (library: LibraryCache): void =>
    dispatch({ type: SET_LIBRARY, payload: { library } });

  const saveLibraryData = async (): Promise<void> => {
    if (libraryCache.length) {
      setData(libraryCache);
      setContent(addPronunciationField(libraryCache[tabIndex].content));
      return;
    }

    await getData({
      service: { method: 'get', endpoint: 'library' },
      modal: { dispatch, text: 'Cargando libreria' },
      success: (data): void => {
        const newData: any[] = [...data];

        newData.unshift(verbs);

        setData(newData);
        setContent(addPronunciationField(newData[tabIndex].content));
        saveLibraryCacheData(newData);
      }
    });
  }

  const addPronunciationField = (content: Item[]): Item[] =>
    content.map((item: Item) => ({ ...item, ...(item.audioUrl ? { pronunciation: item.audioUrl } : {}) }))

  const handlerOnTab = (index: number): void => {
    setContent(addPronunciationField(data[index].content));
    setTabIndex(index);
  }

  const onCheck = (isCorrect: boolean, englishWord: string): void =>
    setSpeech((currentState) => ({ ...currentState, [englishWord]: isCorrect }));

  const handlerOnClickRow = (value: any): JSX.Element =>
    <span
      style={{ cursor: 'pointer' }}
      onClick={() => { setContent(value.content); }}
    >
      {value.name}
    </span>;

  const englishVerbConjugation = ({
    item,
    lang = 'en',
    text = ''
  }: EnglishVerbConjugation): JSX.Element => {
    const { verb = '' } = item;

    const englishPronouns: string[] = ['I', 'You', 'We', 'They', 'You', 'She', 'He', 'It'];
    const spanishPronouns: string[] = ['Yo', 'Tú', 'Él', 'Ella', 'Usted', 'Nosotros(as)', 'Ellos(as)', 'Ustedes'];
    const singularPronouns: string[] = ['She', 'He', 'It'];

    const isSpanish: boolean = lang === 'es';
    const pronouns: string[] = isSpanish ? spanishPronouns : englishPronouns;
    const translation: (string | string[])[] = isSpanish ? item.spanishTranslationConjugation || [] : [verb];
    const style: any = {
      marginBottom: '10px',
      textTransform: 'initial',
    };

    const getTranslation = (translation: any, pronoun: string): string =>
      translation.split(' ').length > 1 ? '' : pronoun;

    return (
      <div>
        {pronouns.map((pronoun: string, index: number): JSX.Element => (
          <div style={style} key={pronoun}>
            {getTranslation(translation[index] || verb, pronoun)} {translation[index] || verb}
            {singularPronouns.includes(pronoun) && !isSpanish && (
              <strong style={{ color: 'blue', textDecoration: 'underline' }}>s</strong>
            )}
            {text ? <span> {text}</span> : ''}
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
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
                  className={`${style.vocabularies__tab} ${tabIndex === index ? style.vocabularies__tabFocus : ''}`}
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
                  render: (value: string): JSX.Element =>
                    <Sound src={value} style={style} width="80px" />
                },
                pronunciation: {
                  value: 'Pronunciación',
                  render: (value: string, item: Item): JSX.Element =>
                    <Speech
                      audioUrl={value}
                      onCheck={(isCorrect: boolean) => onCheck(isCorrect, item.englishWord)}
                      word={item.englishWord}
                      canShowMessage={false}
                    />
                },
                imageUrl: {
                  value: 'Referencia',
                  render: (value: string, item: Item): JSX.Element => (
                    <div className={style.table__image_container}>
                      <img
                        alt="vocabulary image"
                        className={style.table__image}
                        loading="lazy"
                        src={value}
                      />
                      {typeof speech[item.englishWord] !== 'undefined' && (
                        <span
                          className={style.table__feedback}
                          style={{ background: speech[item.englishWord] ? '#4caf50' : '#f44336' }}
                        >
                          {speech[item.englishWord] ? 'Correcto' : 'Incorrecto'}
                        </span>
                      )}
                    </div>
                  )
                },
                // VERB STRUCTURE
                curse: {
                  value: 'cursos',
                  render: handlerOnClickRow
                },
                lession: {
                  value: 'lecciones',
                  render: handlerOnClickRow
                },
                verb: {
                  value: 'verbo',
                  render: (value: string): JSX.Element =>
                    <strong style={{ color: 'blue' }}>{value}</strong>
                },
                englishWordConjugation: {
                  value: 'Inglés',
                  render: (_: string, item: Item): JSX.Element =>
                    englishVerbConjugation({ item })
                },
                spanishTranslationConjugationExample: {
                  value: 'Ejemplos en español',
                  render: (value: string, item: Item): JSX.Element =>
                    englishVerbConjugation({ text: value, item, lang: 'es' })
                },
                englishWordConjugationExample: {
                  value: 'Ejemplos en Inglés',
                  render: (value: string, item: Item): JSX.Element =>
                    englishVerbConjugation({ text: value, item })
                },
                spanishTranslationConjugation: {
                  value: 'Español',
                  render: (_: string, item: Item): JSX.Element =>
                    englishVerbConjugation({ item, lang: 'es' })
                },
              }}
            />
          </div>
        </div>
      </section>
    </>
  );
}

export default Library;

