import React, { useContext, useState, useEffect, useCallback, StrictMode } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { send } from '../../../tools/function';
import style from './style.module.sass';
import { HTTP_STATUS_CODES } from '../../../tools/constant';
import context from '../../../global/state/context';
import { State, Word, Course } from '../../../global/state/type';
import { CLEAN_CACHE } from '../../../global/state/actionTypes';

interface LessonData {
  title: string;
  words: Word[];
  lessonNumber: number;
}

interface CourseWithWords {
  _id: string;
  title: string;
  description: string;
  color: string;
  picture: string;
  isAvaliable: boolean;
  words?: Word[];
}

const LessonManagement = (): JSX.Element => {
  const [courses, setCourses] = useState<CourseWithWords[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [lessons, setLessons] = useState<LessonData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isDragDisabled, setIsDragDisabled] = useState<boolean>(false);
  const [dragEnabled, setDragEnabled] = useState<boolean>(true);
  const [_, dispatch] = useContext<[State, any]>(context);

  useEffect(() => {
    loadCourses();
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      loadCourseWords();
    }
  }, [selectedCourse]);

  useEffect(() => {
    // Enable drag after component mounts to avoid SSR issues
    const timer = setTimeout(() => {
      setDragEnabled(true);
    }, 100);

    return () => clearTimeout(timer);
  }, [lessons]);

  const loadCourses = async (): Promise<void> => {
    setLoading(true);
    try {
      const { response: { data, statusCode } } = await send({ api: 'courses' }).get();

      if (statusCode === HTTP_STATUS_CODES.OK && data) {
        setCourses(data);
      }
    } catch (error) {
      console.error('Error loading courses:', error);
      alert('Error al cargar los cursos');
    } finally {
      setLoading(false);
    }
  };

  const loadCourseWords = async (): Promise<void> => {
    setLoading(true);
    try {
      // Por ahora usamos la API de curso de estudiante para obtener las palabras
      // En el próximo prompt se implementará la API específica del backend
      const { response: { data, statusCode } } = await send({
        api: `student-course/${selectedCourse}`
      }).get();

      if (statusCode === HTTP_STATUS_CODES.OK && data && data.words) {
        const formattedLessons = formatWordsIntoLessons(data.words);
        setLessons(formattedLessons);
      }
    } catch (error) {
      console.error('Error loading course words:', error);
      alert('Error al cargar las palabras del curso');
    } finally {
      setLoading(false);
    }
  };

  const formatWordsIntoLessons = (words: Word[]): LessonData[] => {
    const lessonsData: LessonData[] = [];
    const wordsPerLesson = 30;
    
    for (let i = 0; i < words.length; i += wordsPerLesson) {
      const lessonWords = words.slice(i, i + wordsPerLesson);
      const lessonNumber = Math.floor(i / wordsPerLesson) + 1;
      
      lessonsData.push({
        title: `Lección ${lessonNumber}`,
        words: lessonWords,
        lessonNumber
      });
    }
    
    return lessonsData;
  };

  const onDragEnd = useCallback((result: DropResult): void => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Extract word ID from draggableId (format: "word-wordId")
    const wordId = draggableId.replace('word-', '');

    const sourceLesson = lessons.find(lesson =>
      lesson.lessonNumber.toString() === source.droppableId
    );
    const destLesson = lessons.find(lesson =>
      lesson.lessonNumber.toString() === destination.droppableId
    );

    if (!sourceLesson || !destLesson) return;

    const draggedWord = sourceLesson.words.find(word =>
      word._id.toString() === wordId
    );

    if (!draggedWord) return;

    // Create new lessons array with updated word positions
    const newLessons = lessons.map(lesson => {
      if (lesson.lessonNumber.toString() === source.droppableId) {
        // Remove word from source lesson
        return {
          ...lesson,
          words: lesson.words.filter(word => word._id.toString() !== wordId)
        };
      }

      if (lesson.lessonNumber.toString() === destination.droppableId) {
        // Add word to destination lesson
        const newWords = [...lesson.words];
        newWords.splice(destination.index, 0, draggedWord);
        return {
          ...lesson,
          words: newWords
        };
      }

      return lesson;
    });

    setLessons(newLessons);
  }, [lessons]);

  const saveChanges = async (): Promise<void> => {
    if (!selectedCourse) return;

    // Flatten all words with their new lesson assignments
    const updatedWords = lessons.flatMap((lesson, lessonIndex) =>
      lesson.words.map((word, wordIndex) => ({
        _id: word._id,
        lessonNumber: lesson.lessonNumber,
        orderInLesson: wordIndex,
        globalOrder: lessonIndex * 25 + wordIndex
      }))
    );

    console.log('Palabras reorganizadas:', updatedWords);

    alert(`Panel de administración listo!

Se han reorganizado ${updatedWords.length} palabras en ${lessons.length} lecciones.

En el próximo prompt se implementará la funcionalidad del backend para guardar estos cambios permanentemente.

Los cambios actuales se muestran en la consola del navegador para verificación.`);

    // Limpiar caché para refrescar datos
    dispatch({ type: CLEAN_CACHE });
  };

  return (
    <div className={style.lessonManagement}>
      <header className={style.header}>
        <h1>Gestión de Lecciones</h1>
        <p>Arrastra y suelta las palabras para reorganizar las lecciones</p>
      </header>

      <div className={style.controls}>
        <div className={style.courseSelector}>
          <label htmlFor="course-select">Seleccionar Curso:</label>
          <select
            id="course-select"
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            disabled={loading}
          >
            <option value="">-- Selecciona un curso --</option>
            {courses.map((course) => (
              <option key={course._id} value={course._id}>
                {course.title}
              </option>
            ))}
          </select>
        </div>

        {selectedCourse && (
          <button
            className={style.saveButton}
            onClick={saveChanges}
            disabled={loading}
          >
            {loading ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        )}
      </div>

      {loading && (
        <div className={style.loading}>
          <p>Cargando...</p>
        </div>
      )}

      {!loading && lessons.length > 0 && !dragEnabled && (
        <div className={style.loading}>
          <p>Preparando interfaz de arrastrar y soltar...</p>
        </div>
      )}

      {!loading && lessons.length > 0 && dragEnabled && (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className={style.lessonsContainer}>
            {lessons.map((lesson) => (
              <div key={`lesson-${lesson.lessonNumber}`} className={style.lesson}>
                <h3 className={style.lessonTitle}>
                  {lesson.title} ({lesson.words.length} palabras)
                </h3>

                <Droppable droppableId={lesson.lessonNumber.toString()}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`${style.wordsList} ${
                        snapshot.isDraggingOver ? style.draggingOver : ''
                      }`}
                    >
                      {lesson.words.map((word, index) => {
                        const draggableId = `word-${word._id}`;
                        return (
                          <Draggable
                            key={draggableId}
                            draggableId={draggableId}
                            index={index}
                            isDragDisabled={isDragDisabled}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`${style.wordCard} ${
                                  snapshot.isDragging ? style.dragging : ''
                                }`}
                              >
                                <div className={style.wordContent}>
                                  <span className={style.englishWord}>
                                    {word.englishWord}
                                  </span>
                                  <span className={style.spanishTranslation}>
                                    {word.spanishTranslation}
                                  </span>
                                </div>
                                <div className={style.dragHandle}>⋮⋮</div>
                              </div>
                            )}
                          </Draggable>
                        );
                      })}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>
      )}

      {!loading && selectedCourse && lessons.length === 0 && (
        <div className={style.noData}>
          <p>No se encontraron palabras para este curso</p>
        </div>
      )}
    </div>
  );
};

export default LessonManagement;
