import React, { useContext, useState } from 'react';
import { send } from '../../../tools/function';
import style from './style.module.sass';
import { HTTP_STATUS_CODES } from '../../../tools/constant';
import context from '../../../global/state/context';
import { State } from '../../../global/state/type';
import { CLEAN_CACHE } from '../../../global/state/actionTypes';

const EditWords = (): JSX.Element => {
  const [searchTerm, setSearchTerm] = useState('');
  const [words, setWords] = useState<any[]>([]);
  const [wordToEdit, setWordToEdit] = useState<any>(null);
  const [_, dispatch] = useContext<[State, any]>(context);

  const onSearchChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(event.target.value);
  };

  const onSearchSubmit = async (): Promise<void> => {
    const {
      response: { data },
    } = await send({ api: 'search-word', data: { searchTerm } }).post();

    if (data) {
      setWords(data);
      setWordToEdit(null);
    } else {
      console.error('Error fetching words:');
    }
  };

  const onWordEdit = (word: any) => {
    setWordToEdit({ ...word });
  };

  const handleSave = async () => {
   const { response: { data, statusCode } } =  await send({ api: 'update-word', data: wordToEdit }).put();

    if (statusCode === HTTP_STATUS_CODES.OK) {
      setWords([]);
      setWordToEdit(null);
      alert('Se ha actualizado exitosamente.');
      dispatch({ type: CLEAN_CACHE });
      console.log(data);
    } else {
      alert('Error al actualizar los datos.');
    }
  };

  const formatFieldName = (input: string): string =>
    input.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase()).trim();

  const handleInputChange = (key: string, value: any, index?: number): void => {
    setWordToEdit((prev: any) => {
      if (typeof index === 'number') {
        const sentences = [...prev.sentences || []];

        sentences[index] = {
          ...sentences[index],
          [key]: key === 'audioSplitUrls' ? value.split(',') : '',
        };

        return { ...prev, sentences };
      }

      return { ...prev, [key]: value };
    });
  };

  return (
    <div className={style.word}>
      <header>
        <h1>Edición de Palabras</h1>
      </header>

      <div className={style.word__search}>
        <input
          type="text"
          placeholder="Buscar palabra"
          value={searchTerm}
          onChange={onSearchChange}
        />
        <button className={style['word__search-button']} onClick={onSearchSubmit}>
          Buscar
        </button>
      </div>

      <div className={style.word__list}>
        {words.length > 0 &&
          words.map((word, index) => (
            <button
              key={word._id || index}
              onClick={() => onWordEdit(word)}
              className={style.word__button}
            >
              {word.englishWord} - {word.spanishTranslation}
            </button>
          ))}
      </div>

      {wordToEdit && (
        <form className={style.word__form}>
          <h2>Editar Palabra</h2>

          {Object.entries(wordToEdit).map(([key, value]: any) => {
            if (['sentences', '_id'].includes(key)) return null;

            return (
              <div className={style['input-group']} key={key}>
                <label htmlFor={key}>{formatFieldName(key)}: </label>
                <input
                  type="text"
                  value={value}
                  onChange={(e) => handleInputChange(key, e.target.value)}
                />
              </div>
            )
          })}

          {wordToEdit.sentences.map((sentence: any, row: number) => (
            <div key={row}>
              <div className={style.word__sentence}>
                <span className={style['word__sentence-title']}>
                  {sentence.englishWord} ({row + 1})
                </span>
              </div>

              {Object.entries(sentence).map(([key, value]: any) => {
                if (key === '_id') return null;

                return (
                  <div className={style['input-group']} key={key}>
                    <label htmlFor={key}>{formatFieldName(key)}: </label>
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => handleInputChange(key, e.target.value, row)}
                    />
                  </div>
                )
              })}
            </div>
          ))}

          <button
            type="button"
            onClick={handleSave}
            className={style['word__save-button']}
          >
            Guardar
          </button>
        </form>
      )}
    </div>
  );
};

export default EditWords;
