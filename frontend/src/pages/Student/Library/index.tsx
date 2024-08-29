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
import verbs from './verbs.json';
import Head from './Head';
import pronunciation from './pronunciation.json';
import ImageLazy from '../../../components/ImageLazy';

const Library: React.FC = (): JSX.Element => {
  const [data, setData] = useState<LibraryCache>([]);
  const [content, setContent] = useState<LibraryContent[]>([]);
  const [tabIndex, setTabIndex] = useState<number>(0);
  const [{ libraryCache }, dispatch] = useContext(context);
  const [speech, setSpeech] = useState<{
    [key: string]: {
      isCorrect: boolean;
      canShow: boolean;
    };
  }>({});

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

  const onCheck = (isCorrect: boolean, englishWord: string): void => {
    setSpeech((currentState) => ({
      ...currentState,
      [englishWord]: { isCorrect, canShow: true }
    }));
  }

  const onPlaySpeech = (isPlay: boolean, englishWord: string): void => {
    isPlay && setSpeech((currentState) => ({
      ...currentState,
      [englishWord]: { isCorrect: false, canShow: false }
    }));
  }

  const handlerOnClickRow = (value: any): JSX.Element =>
    <span
      style={{ cursor: 'pointer' }}
      onClick={() => { setContent(value.content); }}
    >
      {value.name}
    </span>;

  const englishVerbConjugation = ({ item, lang = 'en', text = '' }: EnglishVerbConjugation): JSX.Element => {
    const { verb = '', avoidPronouns = [], apostrophe = false } = item;

    const pronounsMap = {
      en: {
        gerund: ['I am', 'You are', 'He is', 'She is', 'It is', 'We are', 'You (plural) are', 'They are'],
        base: ['I', 'You', 'He', 'She', 'It', 'We', 'You (plural)', 'They'],
        singular: ['She', 'He', 'It'],
      },
      es: ['Yo', 'Tú', 'Él', 'Ella', '(Eso)', 'Nosotros(as)', 'Ustedes', 'Ellos(as)']
    };

    const isSpanish = lang === 'es';
    const translation = isSpanish ? item.spanishTranslationConjugation || [] : [];
    const pronouns = isSpanish
      ? pronounsMap.es
      : verb.includes('ing') && !['bring', 'sing'].includes(verb)
        ? pronounsMap.en.gerund
        : pronounsMap.en.base;


    const getTranslation = (translation: string, pronoun: string): string =>
      translation.split(' ').length > 1 ? '' : pronoun;

    const getApostrophe = (): string => {
      const lastLetter = verb.slice(-1);
      if (['carry', 'fly', 'try', 'study'].includes(verb)) return 'ies';

      return lastLetter === 'o' || lastLetter === 'h' ? 'es' : 's';
    };

    const getVerb = (pronoun: string): string => {
      const isValid = ['He', 'She', 'It'].includes(pronoun);

      if (
        isValid && verb[verb.length - 1] === 'y' &&
        !['buy', 'stay', 'pay', 'play'].includes(verb)
      ) {
        return verb.replace('y', '');
      }

      return ({
        be: 'will be',
        come: 'will come',
        let: 'will let',
        walk: 'will walk'
      }[verb] || verb.replace('-', ' '));
    };

    return (
      <div>
        {pronouns.map((pronoun: string, index: number) => (
          !avoidPronouns.includes(pronounsMap.en.base[index]) && (
            <div key={index} className={style.table__verb}>
              {getTranslation(translation[index] || verb, pronoun)}
              <span> {translation[index] || getVerb(pronoun)}</span>
              {pronounsMap.en.singular.includes(pronoun) && !isSpanish && !apostrophe && (
                <strong className={style.table__verbText}>
                  {getApostrophe()}
                </strong>
              )}
              {verb === 'search' ? ' for' : ''}
              {text && <span> {text}</span>}.
            </div>
          )
        ))}
      </div>
    );
  };

  return (
    <>
      <Head
        title="Librería"
        description="Descubre una amplia colección de vocabulario en inglés y verbos esenciales para mejorar tus habilidades lingüísticas. Perfecto para estudiantes de todos los niveles, ofrece recursos prácticos para aprender y dominar el inglés con facilidad."
      />
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
                    <Sound src={value} style={style} />
                },
                pronunciation: {
                  value: 'Pronunciación',
                  render: (value: string, item: Item): JSX.Element =>
                    <div className={style.table__pronunciation}>
                      <Speech
                        audioUrl={value}
                        onCheck={(isCorrect: boolean) => onCheck(isCorrect, item.englishWord)}
                        onPlaySpeech={(isPlay: boolean) => onPlaySpeech(isPlay, item.englishWord)}
                        word={item.englishWord}
                        canShowMessage={false}
                        canNext={pronunciation}
                      />
                    </div>
                },
                imageUrl: {
                  value: 'Referencia',
                  render: (value: string, item: Item): JSX.Element => (
                    <div className={style.table__image_container}>
                      <ImageLazy
                        alt={`Vocabulary - ${item.englishWord}`}
                        className={style.table__image}
                        src={value}
                      />
                      {typeof speech[item.englishWord] !== 'undefined' && speech[item.englishWord].canShow && (
                        <span
                          className={style.table__feedback}
                          style={{ background: speech[item.englishWord].isCorrect ? '#4caf50' : '#f44336' }}
                        >
                          {speech[item.englishWord].isCorrect ? 'Correcto' : 'Incorrecto'}
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
                avoidPronouns: {
                  avoid: true
                },
                apostrophe: {
                  avoid: true
                },
                lession: {
                  value: 'lecciones',
                  render: handlerOnClickRow
                },
                verb: {
                  value: 'verbo',
                  render: (value: string = ''): JSX.Element =>
                    <strong className={style.table__verbText}>
                      {value.replace('-', ' ')}
                    </strong>
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

