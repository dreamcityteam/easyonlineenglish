import { Response } from 'express';
import { catchTry, connectToDatabase } from '../../tools/functions';
import { HTTP_STATUS_CODES } from '../../tools/consts';
import { RequestType } from '../../tools/type';
import CourseWord from '../../schemas/courseWord.schema';
import Course from '../../schemas/course.schema';

interface CreateWordRequest {
  englishWord: string;
  spanishTranslation: string;
  audioUrl?: string;
  sentences: {
    englishWord: string;
    spanishTranslation: string;
    imageUrl?: string;
    audioUrl: string;
    audioSlowUrl?: string;
    audioSplitUrls?: string[];
  }[];
  courseId: string;
  expandedExplanation?: {
    description?: string;
    usageNotes?: string[];
    additionalExamples?: {
      english: string;
      spanish: string;
      context?: string;
    }[];
    isActive?: boolean;
  };
}

const endpoint = async (req: RequestType, res: Response) => {
  await catchTry({
    res,
    message: 'Error creating word',
    endpoint: async (response) => {
      await connectToDatabase();

      const { englishWord, spanishTranslation, audioUrl, sentences, courseId, expandedExplanation }: CreateWordRequest = req.body;

      // Validar campos requeridos
      if (!englishWord || !spanishTranslation || !courseId) {
        response.statusCode = HTTP_STATUS_CODES.BAD_REQUEST;
        response.message = 'englishWord, spanishTranslation, and courseId are required.';
        return;
      }

      if (!sentences || sentences.length === 0) {
        response.statusCode = HTTP_STATUS_CODES.BAD_REQUEST;
        response.message = 'At least one sentence is required.';
        return;
      }

      // Validar que el curso exista
      const course = await Course.findById(courseId);
      if (!course) {
        response.statusCode = HTTP_STATUS_CODES.NOT_FOUND;
        response.message = 'Course not found.';
        return;
      }

      // Revisar si ya existe la palabra en este curso
      const existingWord = await CourseWord.findOne({ 
        englishWord: englishWord.trim(),
        idCourse: courseId,
        type: 'word'
      });
      if (existingWord) {
        response.statusCode = HTTP_STATUS_CODES.CONFLICT;
        response.message = `Word "${englishWord}" already exists in this course.`;
        return;
      }

      // Calcular lesson/orden
      const totalWords = await CourseWord.countDocuments({ idCourse: courseId, type: 'word' });
      const globalOrder = totalWords;
      const lessonNumber = Math.floor(totalWords / 25) + 1;
      const orderInLesson = totalWords % 25;

      // Validar cada sentence
      for (const sentence of sentences) {
        if (!sentence.englishWord || !sentence.spanishTranslation || !sentence.audioUrl) {
          response.statusCode = HTTP_STATUS_CODES.BAD_REQUEST;
          response.message = 'Each sentence must have englishWord, spanishTranslation, and audioUrl.';
          return;
        }
      }

        // Create new word
        const newWord = new CourseWord({
          type: 'word',
          englishWord: englishWord.trim(),
          spanishTranslation: spanishTranslation.trim(),
          audioUrl: audioUrl || '',
          sentences: sentences.map(sentence => ({
            englishWord: sentence.englishWord.trim(),
            spanishTranslation: sentence.spanishTranslation.trim(),
            imageUrl: sentence.imageUrl || '',
            audioUrl: sentence.audioUrl.trim(),
            audioSlowUrl: sentence.audioSlowUrl || '',
            audioSplitUrls: sentence.audioSplitUrls || []
          })),
          ...(expandedExplanation && {
            expandedExplanation: {
              description: expandedExplanation.description || '',
              usageNotes: expandedExplanation.usageNotes || [],
              additionalExamples: expandedExplanation.additionalExamples || [],
              isActive: expandedExplanation.isActive || false
            }
          }),
          idCourse: courseId,
          lessonNumber,
          orderInLesson,
          globalOrder,
          createdAt: new Date(),
          updatedAt: new Date()
        });

      const savedWord = await newWord.save();

      // Respuesta simplificada según recomendación
      response.statusCode = HTTP_STATUS_CODES.CREATED;
      response.message = 'Word created successfully';
      response.data = savedWord;
    },
  });
};

export default endpoint;
