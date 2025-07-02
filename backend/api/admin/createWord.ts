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
}

const endpoint = async (req: RequestType, res: Response) => {
  await catchTry({
    res,
    message: 'Error creating word',
    endpoint: async (response) => {
      await connectToDatabase();

      const { englishWord, spanishTranslation, audioUrl, sentences, courseId }: CreateWordRequest = req.body;

      // Validate required fields
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

      // Validate course exists
      const course = await Course.findById(courseId);
      if (!course) {
        response.statusCode = HTTP_STATUS_CODES.NOT_FOUND;
        response.message = 'Course not found.';
        return;
      }

      // Check if word already exists in this course
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

      try {
        // Calculate automatic lesson assignment
        const totalWords = await CourseWord.countDocuments({ 
          idCourse: courseId, 
          type: 'word' 
        });

        const globalOrder = totalWords;
        const lessonNumber = Math.floor(totalWords / 25) + 1;
        const orderInLesson = totalWords % 25;

        // Validate sentences
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
          idCourse: courseId,
          lessonNumber,
          orderInLesson,
          globalOrder,
          createdAt: new Date(),
          updatedAt: new Date()
        });

        const savedWord = await newWord.save();

        // Log the creation for audit purposes
        console.log(`Admin ${req.user._id} created new word:`, {
          wordId: savedWord._id,
          englishWord: savedWord.englishWord,
          courseId: courseId,
          lessonNumber: savedWord.lessonNumber,
          globalOrder: savedWord.globalOrder,
          timestamp: new Date().toISOString()
        });

        response.statusCode = HTTP_STATUS_CODES.CREATED;
        response.message = 'Word created successfully';
        response.data = {
          _id: savedWord._id,
          englishWord: savedWord.englishWord,
          spanishTranslation: savedWord.spanishTranslation,
          lessonNumber: savedWord.lessonNumber,
          orderInLesson: savedWord.orderInLesson,
          globalOrder: savedWord.globalOrder,
          sentencesCount: savedWord.sentences.length,
          message: `Word "${savedWord.englishWord}" created and assigned to Lesson ${savedWord.lessonNumber}`
        };

      } catch (error: any) {
        console.error('Error creating word:', error);
        response.statusCode = HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;
        response.message = 'Database error while creating word.';
      }
    },
  });
};

export default endpoint;
