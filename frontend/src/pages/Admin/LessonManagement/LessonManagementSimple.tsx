import React, { useContext, useState, useEffect } from 'react';
import { send } from '../../../tools/function';
import style from './style.module.sass';
import { HTTP_STATUS_CODES } from '../../../tools/constant';
import context from '../../../global/state/context';
import { State, Word } from '../../../global/state/type';
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

const LessonManagementSimple = (): JSX.Element => {
  const [courses, setCourses] = useState<CourseWithWords[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [lessons, setLessons] = useState<LessonData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [draggedWord, setDraggedWord] = useState<Word | null>(null);
  const [draggedFromLesson, setDraggedFromLesson] = useState<number | null>(null);
  const [draggedFromIndex, setDraggedFromIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [dragOverLesson, setDragOverLesson] = useState<number | null>(null);
  const [_, dispatch] = useContext<[State, any]>(context);

  useEffect(() => {
    loadCourses();
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      loadCourseWords();
    }
  }, [selectedCourse]);

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
    const lessonsMap = new Map<number, Word[]>();

    // Agrupar palabras por su lessonNumber existente
    words.forEach(word => {
      const lessonNum = (word as any).lessonNumber || 1;
      if (!lessonsMap.has(lessonNum)) {
        lessonsMap.set(lessonNum, []);
      }
      lessonsMap.get(lessonNum)!.push(word);
    });

    // Convertir a array de lecciones ordenadas
    const lessonsData: LessonData[] = [];
    const sortedLessonNumbers = Array.from(lessonsMap.keys()).sort((a, b) => a - b);

    sortedLessonNumbers.forEach(lessonNumber => {
      const lessonWords = lessonsMap.get(lessonNumber)!;
      // Ordenar palabras dentro de la lección por orderInLesson
      lessonWords.sort((a, b) => {
        const orderA = (a as any).orderInLesson || 0;
        const orderB = (b as any).orderInLesson || 0;
        return orderA - orderB;
      });

      lessonsData.push({
        title: `Lección ${lessonNumber}`,
        words: lessonWords,
        lessonNumber
      });
    });

    return lessonsData;
  };

  const handleDragStart = (e: React.DragEvent, word: Word, lessonNumber: number, wordIndex: number) => {
    setDraggedWord(word);
    setDraggedFromLesson(lessonNumber);
    setDraggedFromIndex(wordIndex);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, lessonNumber?: number, wordIndex?: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';

    if (lessonNumber !== undefined) {
      setDragOverLesson(lessonNumber);
    }
    if (wordIndex !== undefined) {
      setDragOverIndex(wordIndex);
    }
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
    setDragOverLesson(null);
  };

  const handleDrop = (e: React.DragEvent, targetLessonNumber: number, targetIndex?: number) => {
    e.preventDefault();

    if (!draggedWord || draggedFromLesson === null || draggedFromIndex === null) {
      resetDragState();
      return;
    }

    // If dropping in the same position, do nothing
    if (draggedFromLesson === targetLessonNumber &&
        draggedFromIndex === targetIndex) {
      resetDragState();
      return;
    }

    // Check if target lesson would exceed 50 words limit (only for inter-lesson moves)
    if (draggedFromLesson !== targetLessonNumber) {
      const targetLesson = lessons.find(lesson => lesson.lessonNumber === targetLessonNumber);
      if (targetLesson && targetLesson.words.length >= 50) {
        alert('No se puede agregar más palabras. Esta lección ya tiene el máximo de 50 palabras.');
        resetDragState();
        return;
      }
    }

    const newLessons = lessons.map(lesson => {
      // Handle reordering within the same lesson
      if (lesson.lessonNumber === draggedFromLesson &&
          lesson.lessonNumber === targetLessonNumber) {

        const newWords = [...lesson.words];

        // Remove the dragged word from its original position
        newWords.splice(draggedFromIndex, 1);

        // Calculate the new target index after removal
        let newTargetIndex = targetIndex !== undefined ? targetIndex : newWords.length;

        // Adjust target index if it's after the original position
        if (targetIndex !== undefined && targetIndex > draggedFromIndex) {
          newTargetIndex = targetIndex - 1;
        }

        // Insert the word at the new position
        newWords.splice(newTargetIndex, 0, draggedWord);

        return {
          ...lesson,
          words: newWords
        };
      }

      // Handle moving between different lessons
      if (lesson.lessonNumber === draggedFromLesson) {
        // Remove word from source lesson
        return {
          ...lesson,
          words: lesson.words.filter(word => word._id !== draggedWord._id)
        };
      }

      if (lesson.lessonNumber === targetLessonNumber) {
        const newWords = [...lesson.words];

        // If targetIndex is specified, insert at that position
        if (targetIndex !== undefined) {
          newWords.splice(targetIndex, 0, draggedWord);
        } else {
          // Otherwise, add to the end
          newWords.push(draggedWord);
        }

        return {
          ...lesson,
          words: newWords
        };
      }

      return lesson;
    });

    setLessons(newLessons);
    resetDragState();
  };

  const resetDragState = () => {
    setDraggedWord(null);
    setDraggedFromLesson(null);
    setDraggedFromIndex(null);
    setDragOverIndex(null);
    setDragOverLesson(null);
  };

  const saveChanges = async (): Promise<void> => {
    if (!selectedCourse) return;

    setLoading(true);
    try {
      // Prepare the data for the API
      let globalOrderCounter = 0;
      const updatedWords = lessons.flatMap((lesson) =>
        lesson.words.map((word, wordIndex) => {
          const wordData = {
            _id: word._id,
            lessonNumber: lesson.lessonNumber,
            orderInLesson: wordIndex,
            globalOrder: globalOrderCounter++
          };
          return wordData;
        })
      );

      const { response: { statusCode, data } } = await send({
        api: 'admin-update-lesson-order',
        data: {
          courseId: selectedCourse,
          words: updatedWords
        }
      }).put();

      if (statusCode === HTTP_STATUS_CODES.OK) {
        const performance = data.performance || {};
        const actuallyModified = data.updatedCount || data.modifiedCount || 0;

        alert(`¡Cambios guardados exitosamente! ⚡

📊 Resumen:
• ${actuallyModified} palabras actualizadas
• ${lessons.length} lecciones reorganizadas
• Operación optimizada (${performance.operationType || 'bulk'})

Los estudiantes verán las lecciones en el nuevo orden.`);

        // Clear cache to refresh data
        dispatch({ type: CLEAN_CACHE });
      } else {
        alert('Error al guardar los cambios. Por favor, inténtalo de nuevo.');
      }
    } catch (error) {
      console.error('Error saving changes:', error);
      alert('Error de conexión al guardar los cambios. Verifica tu conexión a internet.');
    } finally {
      setLoading(false);
    }
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

      {!loading && lessons.length > 0 && (
        <div className={style.lessonsContainer}>
          {lessons.map((lesson) => (
            <div
              key={`lesson-${lesson.lessonNumber}`}
              className={`${style.lesson} ${
                dragOverLesson === lesson.lessonNumber ? style.draggingOver : ''
              }`}
              onDragOver={(e) => handleDragOver(e, lesson.lessonNumber)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, lesson.lessonNumber)}
            >
              <h3 className={style.lessonTitle}>
                {lesson.title} ({lesson.words.length} palabras)
              </h3>

              <div className={style.wordsList}>
                {lesson.words.map((word, index) => (
                  <div
                    key={`word-${word._id}`}
                    className={`${style.wordCard} ${
                      draggedWord?._id === word._id ? style.dragging : ''
                    } ${
                      dragOverIndex === index && dragOverLesson === lesson.lessonNumber ? style.dragOver : ''
                    }`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, word, lesson.lessonNumber, index)}
                    onDragOver={(e) => {
                      e.stopPropagation();
                      handleDragOver(e, lesson.lessonNumber, index);
                    }}
                    onDrop={(e) => {
                      e.stopPropagation();
                      handleDrop(e, lesson.lessonNumber, index);
                    }}
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
                ))}

                {/* Drop zone at the end of the lesson */}
                {draggedWord && lesson.words.length < 50 && (
                  <div
                    className={`${style.dropZone} ${
                      dragOverLesson === lesson.lessonNumber && dragOverIndex === null ? style.active : ''
                    }`}
                    onDragOver={(e) => {
                      e.stopPropagation();
                      handleDragOver(e, lesson.lessonNumber);
                    }}
                    onDrop={(e) => {
                      e.stopPropagation();
                      handleDrop(e, lesson.lessonNumber);
                    }}
                  >
                    Soltar aquí para agregar al final (máx. 50 palabras)
                  </div>
                )}

                {/* Show capacity indicator */}
                <div className={style.capacityIndicator}>
                  {lesson.words.length}/50 palabras
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && selectedCourse && lessons.length === 0 && (
        <div className={style.noData}>
          <p>No se encontraron palabras para este curso</p>
        </div>
      )}
    </div>
  );
};

export default LessonManagementSimple;
