import React, { useContext, useState, useEffect } from 'react';
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
  const [isCreating, setIsCreating] = useState(false);
  const [newWord, setNewWord] = useState<any>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [_, dispatch] = useContext<[State, any]>(context);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async (): Promise<void> => {
    try {
      const { response: { data, statusCode } } = await send({ api: 'courses' }).get();

      if (statusCode === HTTP_STATUS_CODES.OK && data) {
        setCourses(data);
        // Set first course as default if available
        if (data.length > 0) {
          setSelectedCourseId(data[0]._id);
        }
      }
    } catch (error) {
      console.error('Error loading courses:', error);
      alert('Error al cargar los cursos');
    }
  };

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

  const initializeNewWord = () => {
    return {
      englishWord: '',
      spanishTranslation: '',
      audioUrl: '',
      sentences: [
        {
          englishWord: '',
          spanishTranslation: '',
          imageUrl: '',
          audioUrl: '',
          audioSlowUrl: '',
          audioSplitUrls: []
        }
      ],
      expandedExplanation: {
        description: '',
        usageNotes: [''],
        additionalExamples: [
          {
            english: '',
            spanish: '',
            context: ''
          }
        ],
        isActive: false
      }
    };
  };

  const addSentence = () => {
    const newSentence = {
      englishWord: '',
      spanishTranslation: '',
      imageUrl: '',
      audioUrl: '',
      audioSlowUrl: '',
      audioSplitUrls: []
    };
    setNewWord({
      ...newWord,
      sentences: [...newWord.sentences, newSentence]
    });
  };

  const removeSentence = (index: number) => {
    if (newWord.sentences.length > 1) {
      const updatedSentences = newWord.sentences.filter((_: any, i: number) => i !== index);
      setNewWord({
        ...newWord,
        sentences: updatedSentences
      });
    }
  };

  const updateSentence = (index: number, field: string, value: string) => {
    const updatedSentences = [...newWord.sentences];
    updatedSentences[index] = {
      ...updatedSentences[index],
      [field]: value
    };
    setNewWord({
      ...newWord,
      sentences: updatedSentences
    });
  };

  const addUsageNote = () => {
    setNewWord({
      ...newWord,
      expandedExplanation: {
        ...newWord.expandedExplanation,
        usageNotes: [...newWord.expandedExplanation.usageNotes, '']
      }
    });
  };

  const removeUsageNote = (index: number) => {
    if (newWord.expandedExplanation.usageNotes.length > 1) {
      const updatedNotes = newWord.expandedExplanation.usageNotes.filter((_: any, i: number) => i !== index);
      setNewWord({
        ...newWord,
        expandedExplanation: {
          ...newWord.expandedExplanation,
          usageNotes: updatedNotes
        }
      });
    }
  };

  const updateUsageNote = (index: number, value: string) => {
    const updatedNotes = [...newWord.expandedExplanation.usageNotes];
    updatedNotes[index] = value;
    setNewWord({
      ...newWord,
      expandedExplanation: {
        ...newWord.expandedExplanation,
        usageNotes: updatedNotes
      }
    });
  };

  const addExample = () => {
    setNewWord({
      ...newWord,
      expandedExplanation: {
        ...newWord.expandedExplanation,
        additionalExamples: [...newWord.expandedExplanation.additionalExamples, { english: '', spanish: '', context: '' }]
      }
    });
  };

  const removeExample = (index: number) => {
    if (newWord.expandedExplanation.additionalExamples.length > 1) {
      const updatedExamples = newWord.expandedExplanation.additionalExamples.filter((_: any, i: number) => i !== index);
      setNewWord({
        ...newWord,
        expandedExplanation: {
          ...newWord.expandedExplanation,
          additionalExamples: updatedExamples
        }
      });
    }
  };

  const updateExample = (index: number, field: string, value: string) => {
    const updatedExamples = [...newWord.expandedExplanation.additionalExamples];
    updatedExamples[index] = {
      ...updatedExamples[index],
      [field]: value
    };
    setNewWord({
      ...newWord,
      expandedExplanation: {
        ...newWord.expandedExplanation,
        additionalExamples: updatedExamples
      }
    });
  };

  const onCreateNewWord = () => {
    setIsCreating(true);
    setWordToEdit(null);
    setWords([]);
    setNewWord(initializeNewWord());
  };

  const onCancelCreate = () => {
    setIsCreating(false);
    setNewWord(null);
  };

  const handleCreateWord = async () => {
    if (!selectedCourseId) {
      alert('Por favor, selecciona un curso.');
      return;
    }

    if (!newWord.englishWord || !newWord.spanishTranslation) {
      alert('Por favor, completa al menos el nombre en inglés y la traducción.');
      return;
    }

    // Verificar que al menos una oración esté completa
    const completeSentences = newWord.sentences.filter((sentence: any) =>
      sentence.englishWord && sentence.spanishTranslation && sentence.audioUrl
    );

    if (completeSentences.length === 0) {
      alert('Por favor, completa al menos una oración con su traducción y audio.');
      return;
    }

    try {
      const { response: { data, statusCode } } = await send({
        api: 'create-word',
        data: {
          ...newWord,
          courseId: selectedCourseId
        }
      }).post();

      if (statusCode >= 200 && statusCode < 300) {
        alert(`¡Palabra "${data.englishWord}" creada exitosamente!\n\n${data.message}`);
        setIsCreating(false);
        setNewWord(null);
        dispatch({ type: CLEAN_CACHE });
      } else {
        alert('Error al crear la palabra. Por favor, inténtalo de nuevo.');
      }
    } catch (error) {
      console.error('Error creating word:', error);
      alert('Error al crear la palabra. Por favor, inténtalo de nuevo.');
    }
  };

  const handleInputChange = (key: string, value: any, index?: number): void => {
    setWordToEdit((prev: any) => {
      if (typeof index === 'number') {
        const sentences = [...prev.sentences || []];
        const isAudioSplitUrls: boolean = (key === 'audioSplitUrls');

        sentences[index] = {
          ...sentences[index],
          [key]: isAudioSplitUrls ? value.split(',') : value,
        };

        return { ...prev, sentences };
      }

      return { ...prev, [key]: value };
    });
  };

  // Funciones para manejar explicación expandible en edición
  const initializeExpandedExplanation = () => {
    if (!wordToEdit.expandedExplanation) {
      setWordToEdit({
        ...wordToEdit,
        expandedExplanation: {
          description: '',
          usageNotes: [''],
          additionalExamples: [
            {
              english: '',
              spanish: '',
              context: ''
            }
          ],
          isActive: false
        }
      });
    }
  };

  const updateExpandedExplanationField = (field: string, value: any) => {
    if (!wordToEdit.expandedExplanation) {
      initializeExpandedExplanation();
      return;
    }
    setWordToEdit({
      ...wordToEdit,
      expandedExplanation: {
        ...wordToEdit.expandedExplanation,
        [field]: value
      }
    });
  };

  const addUsageNoteToEdit = () => {
    const currentNotes = wordToEdit.expandedExplanation?.usageNotes || [''];
    setWordToEdit({
      ...wordToEdit,
      expandedExplanation: {
        ...wordToEdit.expandedExplanation,
        usageNotes: [...currentNotes, '']
      }
    });
  };

  const removeUsageNoteFromEdit = (index: number) => {
    if (wordToEdit.expandedExplanation && wordToEdit.expandedExplanation.usageNotes.length > 1) {
      const updatedNotes = wordToEdit.expandedExplanation.usageNotes.filter((_: any, i: number) => i !== index);
      setWordToEdit({
        ...wordToEdit,
        expandedExplanation: {
          ...wordToEdit.expandedExplanation,
          usageNotes: updatedNotes
        }
      });
    }
  };

  const updateUsageNoteInEdit = (index: number, value: string) => {
    const currentNotes = wordToEdit.expandedExplanation?.usageNotes || [''];
    const updatedNotes = [...currentNotes];
    updatedNotes[index] = value;
    setWordToEdit({
      ...wordToEdit,
      expandedExplanation: {
        ...wordToEdit.expandedExplanation,
        usageNotes: updatedNotes
      }
    });
  };

  const addExampleToEdit = () => {
    const currentExamples = wordToEdit.expandedExplanation?.additionalExamples || [];
    setWordToEdit({
      ...wordToEdit,
      expandedExplanation: {
        ...wordToEdit.expandedExplanation,
        additionalExamples: [...currentExamples, { english: '', spanish: '', context: '' }]
      }
    });
  };

  const removeExampleFromEdit = (index: number) => {
    if (wordToEdit.expandedExplanation && wordToEdit.expandedExplanation.additionalExamples.length > 1) {
      const updatedExamples = wordToEdit.expandedExplanation.additionalExamples.filter((_: any, i: number) => i !== index);
      setWordToEdit({
        ...wordToEdit,
        expandedExplanation: {
          ...wordToEdit.expandedExplanation,
          additionalExamples: updatedExamples
        }
      });
    }
  };

  const updateExampleInEdit = (index: number, field: string, value: string) => {
    const currentExamples = wordToEdit.expandedExplanation?.additionalExamples || [];
    const updatedExamples = [...currentExamples];
    updatedExamples[index] = {
      ...updatedExamples[index],
      [field]: value
    };
    setWordToEdit({
      ...wordToEdit,
      expandedExplanation: {
        ...wordToEdit.expandedExplanation,
        additionalExamples: updatedExamples
      }
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
          disabled={isCreating}
        />
        <button
          className={style['word__search-button']}
          onClick={onSearchSubmit}
          disabled={isCreating}
        >
          Buscar
        </button>
        <button
          className={style['word__search-button']}
          onClick={onCreateNewWord}
          disabled={isCreating}
          style={{ backgroundColor: '#27ae60', marginLeft: '10px' }}
        >
          + Agregar Nueva
        </button>
      </div>

      {!isCreating && (
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
      )}

      {isCreating && (
        <div className={style.word__form}>
          <h2>Crear Nueva Palabra</h2>

          <div className={style['input-group']}>
            <label>Curso:</label>
            <select
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
            >
              <option value="">-- Selecciona un curso --</option>
              {courses.map((course) => (
                <option key={course._id} value={course._id}>
                  {course.title}
                </option>
              ))}
            </select>
          </div>
          <div className={style['input-group']}>
            <label>Palabra en Inglés:</label>
            <input
              type="text"
              value={newWord?.englishWord || ''}
              onChange={(e) => setNewWord({...newWord, englishWord: e.target.value})}
              placeholder="Ej: Hello"
            />
          </div>
          <div className={style['input-group']}>
            <label>Traducción al Español:</label>
            <input
              type="text"
              value={newWord?.spanishTranslation || ''}
              onChange={(e) => setNewWord({...newWord, spanishTranslation: e.target.value})}
              placeholder="Ej: Hola"
            />
          </div>
          <div className={style['input-group']}>
            <label>Audio URL (opcional):</label>
            <input
              type="text"
              value={newWord?.audioUrl || ''}
              onChange={(e) => setNewWord({...newWord, audioUrl: e.target.value})}
              placeholder="https://..."
            />
          </div>

          <h3>Oraciones (Al menos 1 requerida)</h3>
          {newWord?.sentences?.map((sentence: any, index: number) => (
            <div key={index} style={{ border: '1px solid #ddd', padding: '15px', marginBottom: '15px', borderRadius: '5px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h4>Oración {index + 1}</h4>
                {newWord.sentences.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSentence(index)}
                    style={{
                      backgroundColor: '#e74c3c',
                      color: 'white',
                      border: 'none',
                      padding: '5px 10px',
                      borderRadius: '3px',
                      cursor: 'pointer'
                    }}
                  >
                    Eliminar
                  </button>
                )}
              </div>

              <div className={style['input-group']}>
                <label>Oración en Inglés:</label>
                <input
                  type="text"
                  value={sentence.englishWord || ''}
                  onChange={(e) => updateSentence(index, 'englishWord', e.target.value)}
                  placeholder="Ej: Hello, how are you?"
                />
              </div>

              <div className={style['input-group']}>
                <label>Traducción de la Oración:</label>
                <input
                  type="text"
                  value={sentence.spanishTranslation || ''}
                  onChange={(e) => updateSentence(index, 'spanishTranslation', e.target.value)}
                  placeholder="Ej: Hola, ¿cómo estás?"
                />
              </div>

              <div className={style['input-group']}>
                <label>Imagen de la Oración:</label>
                <input
                  type="text"
                  value={sentence.imageUrl || ''}
                  onChange={(e) => updateSentence(index, 'imageUrl', e.target.value)}
                  placeholder="https://..."
                />
              </div>

              <div className={style['input-group']}>
                <label>Audio de la Oración:</label>
                <input
                  type="text"
                  value={sentence.audioUrl || ''}
                  onChange={(e) => updateSentence(index, 'audioUrl', e.target.value)}
                  placeholder="https://..."
                />
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addSentence}
            style={{
              backgroundColor: '#27ae60',
              color: 'white',
              border: 'none',
              padding: '10px 15px',
              borderRadius: '5px',
              cursor: 'pointer',
              marginBottom: '20px'
            }}
          >
            + Agregar Otra Oración
          </button>

          {/* Sección de Explicación Expandible */}
          <div style={{ border: '2px solid #3498db', padding: '20px', marginBottom: '20px', borderRadius: '10px', backgroundColor: '#f8f9fa' }}>
            <h3 style={{ color: '#3498db', marginBottom: '15px' }}>✨ Explicación Expandible (Opcional)</h3>

            <div className={style['input-group']}>
              <label>
                <input
                  type="checkbox"
                  checked={newWord?.expandedExplanation?.isActive || false}
                  onChange={(e) => setNewWord({
                    ...newWord,
                    expandedExplanation: {
                      ...newWord.expandedExplanation,
                      isActive: e.target.checked
                    }
                  })}
                  style={{ marginRight: '8px' }}
                />
                Activar explicación expandible para esta palabra
              </label>
            </div>

            {newWord?.expandedExplanation?.isActive && (
              <>
                <div className={style['input-group']}>
                  <label>Descripción:</label>
                  <textarea
                    value={newWord.expandedExplanation.description || ''}
                    onChange={(e) => setNewWord({
                      ...newWord,
                      expandedExplanation: {
                        ...newWord.expandedExplanation,
                        description: e.target.value
                      }
                    })}
                    placeholder="Ej: 'Hello' es el saludo más común en inglés. Se usa en cualquier momento del día..."
                    rows={3}
                    style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                  />
                </div>

                <div className={style['input-group']}>
                  <label>Notas de Uso:</label>
                  {newWord.expandedExplanation.usageNotes?.map((note: string, index: number) => (
                    <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
                      <input
                        type="text"
                        value={note}
                        onChange={(e) => updateUsageNote(index, e.target.value)}
                        placeholder="Ej: Se puede usar con extraños"
                        style={{ flex: 1, padding: '8px' }}
                      />
                      {newWord.expandedExplanation.usageNotes.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeUsageNote(index)}
                          style={{ backgroundColor: '#e74c3c', color: 'white', border: 'none', padding: '8px', borderRadius: '3px' }}
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addUsageNote}
                    style={{ backgroundColor: '#3498db', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '3px', fontSize: '12px' }}
                  >
                    + Agregar Nota
                  </button>
                </div>

                <div className={style['input-group']}>
                  <label>Ejemplos Adicionales:</label>
                  {newWord.expandedExplanation.additionalExamples?.map((example: any, index: number) => (
                    <div key={index} style={{ border: '1px solid #ddd', padding: '10px', marginBottom: '10px', borderRadius: '5px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <h5>Ejemplo {index + 1}</h5>
                        {newWord.expandedExplanation.additionalExamples.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeExample(index)}
                            style={{ backgroundColor: '#e74c3c', color: 'white', border: 'none', padding: '5px 8px', borderRadius: '3px', fontSize: '12px' }}
                          >
                            Eliminar
                          </button>
                        )}
                      </div>
                      <input
                        type="text"
                        value={example.english}
                        onChange={(e) => updateExample(index, 'english', e.target.value)}
                        placeholder="Ejemplo en inglés: Hello there!"
                        style={{ width: '100%', padding: '6px', marginBottom: '5px' }}
                      />
                      <input
                        type="text"
                        value={example.spanish}
                        onChange={(e) => updateExample(index, 'spanish', e.target.value)}
                        placeholder="Traducción: ¡Hola!"
                        style={{ width: '100%', padding: '6px', marginBottom: '5px' }}
                      />
                      <input
                        type="text"
                        value={example.context}
                        onChange={(e) => updateExample(index, 'context', e.target.value)}
                        placeholder="Contexto (opcional): Saludo casual entre amigos"
                        style={{ width: '100%', padding: '6px' }}
                      />
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addExample}
                    style={{ backgroundColor: '#3498db', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '3px', fontSize: '12px' }}
                  >
                    + Agregar Ejemplo
                  </button>
                </div>
              </>
            )}
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button
              type="button"
              onClick={handleCreateWord}
              className={style['word__save-button']}
            >
              Crear Palabra
            </button>
            <button
              type="button"
              onClick={onCancelCreate}
              className={style['word__save-button']}
              style={{ backgroundColor: '#e74c3c', marginLeft: '10px' }}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

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

          {/* Sección de Explicación Expandible para Edición */}
          <div style={{ border: '2px solid #e67e22', padding: '20px', marginBottom: '20px', borderRadius: '10px', backgroundColor: '#fdf2e9' }}>
            <h3 style={{ color: '#e67e22', marginBottom: '15px' }}>✨ Explicación Expandible (Opcional)</h3>

            <div className={style['input-group']}>
              <label>
                <input
                  type="checkbox"
                  checked={wordToEdit?.expandedExplanation?.isActive || false}
                  onChange={(e) => {
                    if (!wordToEdit.expandedExplanation) {
                      initializeExpandedExplanation();
                    }
                    updateExpandedExplanationField('isActive', e.target.checked);
                  }}
                  style={{ marginRight: '8px' }}
                />
                Activar explicación expandible para esta palabra
              </label>
            </div>

            {wordToEdit?.expandedExplanation?.isActive && (
              <>
                <div className={style['input-group']}>
                  <label>Descripción:</label>
                  <textarea
                    value={wordToEdit.expandedExplanation?.description || ''}
                    onChange={(e) => updateExpandedExplanationField('description', e.target.value)}
                    placeholder="Ej: 'Hello' es el saludo más común en inglés. Se usa en cualquier momento del día..."
                    rows={3}
                    style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                  />
                </div>

                <div className={style['input-group']}>
                  <label>Notas de Uso:</label>
                  {(wordToEdit.expandedExplanation?.usageNotes || ['']).map((note: string, index: number) => (
                    <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
                      <input
                        type="text"
                        value={note}
                        onChange={(e) => updateUsageNoteInEdit(index, e.target.value)}
                        placeholder="Ej: Se puede usar con extraños"
                        style={{ flex: 1, padding: '8px' }}
                      />
                      {(wordToEdit.expandedExplanation?.usageNotes || ['']).length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeUsageNoteFromEdit(index)}
                          style={{ backgroundColor: '#e74c3c', color: 'white', border: 'none', padding: '8px', borderRadius: '3px' }}
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addUsageNoteToEdit}
                    style={{ backgroundColor: '#e67e22', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '3px', fontSize: '12px' }}
                  >
                    + Agregar Nota
                  </button>
                </div>

                <div className={style['input-group']}>
                  <label>Ejemplos Adicionales:</label>
                  {(wordToEdit.expandedExplanation?.additionalExamples || []).map((example: any, index: number) => (
                    <div key={index} style={{ border: '1px solid #ddd', padding: '10px', marginBottom: '10px', borderRadius: '5px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <h5>Ejemplo {index + 1}</h5>
                        {(wordToEdit.expandedExplanation?.additionalExamples || []).length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeExampleFromEdit(index)}
                            style={{ backgroundColor: '#e74c3c', color: 'white', border: 'none', padding: '5px 8px', borderRadius: '3px', fontSize: '12px' }}
                          >
                            Eliminar
                          </button>
                        )}
                      </div>
                      <input
                        type="text"
                        value={example?.english || ''}
                        onChange={(e) => updateExampleInEdit(index, 'english', e.target.value)}
                        placeholder="Ejemplo en inglés: Hello there!"
                        style={{ width: '100%', padding: '6px', marginBottom: '5px' }}
                      />
                      <input
                        type="text"
                        value={example?.spanish || ''}
                        onChange={(e) => updateExampleInEdit(index, 'spanish', e.target.value)}
                        placeholder="Traducción: ¡Hola!"
                        style={{ width: '100%', padding: '6px', marginBottom: '5px' }}
                      />
                      <input
                        type="text"
                        value={example?.context || ''}
                        onChange={(e) => updateExampleInEdit(index, 'context', e.target.value)}
                        placeholder="Contexto (opcional): Saludo casual entre amigos"
                        style={{ width: '100%', padding: '6px' }}
                      />
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addExampleToEdit}
                    style={{ backgroundColor: '#e67e22', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '3px', fontSize: '12px' }}
                  >
                    + Agregar Ejemplo
                  </button>
                </div>
              </>
            )}
          </div>

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
