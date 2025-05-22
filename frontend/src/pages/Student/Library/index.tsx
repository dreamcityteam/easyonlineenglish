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
import alphabet from './Alphabet.json';
import tips from './basicExpresion.json';
import Image from '../../../components/Image';
import Aside from '../../../components/Aside';
import AlphabetPage from './AlphabetPage/indext';

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
        const newData: any[] = [...alphabet, ...data, ...tips];

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
              <span>{getTranslation(translation[index] || verb, pronoun)}</span>
              <span> {translation[index] || getVerb(pronoun)}</span>
              {pronounsMap.en.singular.includes(pronoun) && !isSpanish && !apostrophe && (
                <strong className={style.table__verbText}>
                  {getApostrophe()}
                </strong>
              )}
              {verb === 'search' ? ' for' : ''}
              {text && <span> {text}.</span>}
            </div>
          )
        ))}
      </div>
    );
  };

  const Feedback = ({ englishWord }: { englishWord: string; }): JSX.Element => (
    <>
      {typeof speech[englishWord] !== 'undefined' && speech[englishWord].canShow && (
        <div
          className={style.table__feedback}
        >
          <Image
            alt="Feedback icon"
            path={speech[englishWord].isCorrect
              ? 'icons/file%20(2)-rUytCHTrOOkY1XVHaQluxJV3jc8ewm.png'
              : 'icons/file%20(1)%20(1)-8wtGfDcRc7aApX2SS1WrAYNhWBfTHl.png'}
          />
        </div>
      )}
    </>
  );

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
          <Aside onClick={handlerOnTab} data={data} tabIndex={tabIndex} />

          {
            data.length &&
              data[tabIndex] &&
              data[tabIndex].name === 'Alfabeto'
              ? <AlphabetPage />
              : (<div className={style.vocabularies__table}>
                <Table
                  data={content}
                  style={style}
                  custom={{
                    _id: { avoid: true },
                    isFeedback: { avoid: true },
                    englishWord: {
                      value: 'Ingles',
                      render: (value: string): JSX.Element =>
                        <span className={style.table__expresion}>
                          {value}
                          {<Feedback englishWord={value} />}
                        </span>
                    },
                    spanishTranslation: {
                      value: 'Español',
                      render: (value: string): JSX.Element =>
                        <span className={style.table__letter}>
                          {value}
                        </span>
                    },
                    audioUrl: {
                      value: 'Audio',
                      render: (value: string): JSX.Element =>
                        <Sound src={value} style={style} />
                    },
                    // LETTER STRCUTURE
                    englishLetter: {
                      value: 'Letra',
                      render: (value: string, item): JSX.Element =>
                        <div className={style.table__letter}>
                          <Sound
                            src={item.englishLetterAudioUrl}
                            style={{}}
                            render={() => <span>{value}</span>}
                          />
                          <Feedback englishWord={value} />
                        </div>
                    },

                    reference: {
                      value: 'Referencia',
                      render: (value: string, item): JSX.Element =>
                        <div className={style.table__letter}>
                          <Sound
                            src={item.referenceAudioUrl}
                            style={{}}
                            render={() => (
                              <div>
                                <span>
                                  <strong style={{ color: 'red' }}>{value[0]}</strong>
                                  {value.substring(1, value.length)}
                                </span>
                              </div>
                            )}
                          />
                          <Feedback englishWord={value} />
                        </div>
                    },

                    pronunciationLetter: {
                      value: 'Pronunciación',
                      render: (value: string, item: any): JSX.Element =>
                        <div>
                          <Speech
                            audioUrl={value}
                            onCheck={(isCorrect: boolean) => onCheck(isCorrect, item.englishLetter)}
                            onPlaySpeech={(isPlay: boolean) => onPlaySpeech(isPlay, item.englishLetter)}
                            word={item.englishLetter}
                            canShowMessage={false}
                            canNext={pronunciation}
                            interimResults
                          />
                        </div>
                    },

                    pronunciationReference: {
                      value: 'Pronunciación',
                      render: (value: string, item: any): JSX.Element =>
                        <div>
                          <Speech
                            audioUrl={value}
                            onCheck={(isCorrect: boolean) => onCheck(isCorrect, item.reference)}
                            onPlaySpeech={(isPlay: boolean) => onPlaySpeech(isPlay, item.reference)}
                            word={item.reference}
                            canShowMessage={false}
                            canNext={pronunciation}
                            interimResults
                          />
                        </div>
                    },

                    // LETTER STRCUTURE
                    englishLetterAudioUrl: {
                      avoid: true,
                      value: 'Letter'
                    },

                    referenceAudioUrl: {
                      avoid: true,
                    },
                    pronunciation: {
                      value: 'Pronunciación',
                      render: (value: string, item: Item): JSX.Element =>
                        <div>
                          <Speech
                            audioUrl={value}
                            onCheck={(isCorrect: boolean) => onCheck(isCorrect, item.englishWord)}
                            onPlaySpeech={(isPlay: boolean) => onPlaySpeech(isPlay, item.englishWord)}
                            word={item.englishWord}
                            canShowMessage={false}
                            canNext={pronunciation}
                            interimResults={tabIndex === 1 || tabIndex === 4 || tabIndex === 7}
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
                          <span>{value.replace('-', ' ')}</span>
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
              </div>)
          }
        </div>
      </section>
    </>
  );
}

export default Library;

