import { Response } from 'express';
import { catchTry, connectToDatabase } from '../../tools/functions';
import { HTTP_STATUS_CODES, MESSAGE, ROLE } from '../../tools/consts';
import { RequestType } from '../../tools/type';
import CourseWord from '../../schemas/courseWord.schema';
import User from '../../schemas/user.schema';

interface WordOrderUpdate {
  _id: string;
  lessonNumber: number;
  orderInLesson: number;
  globalOrder: number;
}

interface UpdateLessonOrderRequest {
  courseId: string;
  words: WordOrderUpdate[];
}

const endpoint = async (req: RequestType, res: Response) => {
  await catchTry({
    res,
    message: 'Error updating lesson order',
    endpoint: async (response) => {
      await connectToDatabase();

      // Verify user is admin (simple check like other admin APIs)
      const user = await User.findOne({ _id: req.user._id }).select({ role: 1 });
      if (!user || user.role !== ROLE.ADMIN) {
        response.statusCode = HTTP_STATUS_CODES.UNAUTHORIZED;
        response.message = 'Access denied. Admin role required.';
        return;
      }

      const { courseId, words }: UpdateLessonOrderRequest = req.body;

      // Validate input
      if (!courseId || !words || !Array.isArray(words)) {
        response.statusCode = HTTP_STATUS_CODES.BAD_REQUEST;
        response.message = 'Invalid request data. courseId and words array are required.';
        return;
      }

      // Validate each word in the array
      for (const word of words) {
        if (!word._id || typeof word.lessonNumber !== 'number' || 
            typeof word.orderInLesson !== 'number' || typeof word.globalOrder !== 'number') {
          response.statusCode = HTTP_STATUS_CODES.BAD_REQUEST;
          response.message = 'Invalid word data structure.';
          return;
        }
      }

      try {
        // Verify all words exist in the specified course
        const existingWords = await CourseWord.find({
          idCourse: courseId,
          _id: { $in: words.map(w => w._id) }
        }).select({ _id: 1 });

        if (existingWords.length !== words.length) {
          response.statusCode = HTTP_STATUS_CODES.BAD_REQUEST;
          response.message = 'Some words do not exist in the specified course.';
          return;
        }

        // Prepare bulk operations for efficient database update
        const bulkOperations = words.map((wordUpdate) => ({
          updateOne: {
            filter: { _id: wordUpdate._id },
            update: {
              $set: {
                lessonNumber: wordUpdate.lessonNumber,
                orderInLesson: wordUpdate.orderInLesson,
                globalOrder: wordUpdate.globalOrder,
                updatedAt: new Date()
              }
            }
          }
        }));

        // Execute all updates in a single bulk operation
        const bulkResult = await CourseWord.bulkWrite(bulkOperations, {
          ordered: false, // Allow parallel execution
          writeConcern: { w: 'majority' } // Ensure write acknowledgment
        });

        // Log the update for audit purposes
        console.log(`Admin ${req.user._id} updated lesson order for course ${courseId}:`, {
          totalWords: words.length,
          modifiedCount: bulkResult.modifiedCount,
          matchedCount: bulkResult.matchedCount,
          timestamp: new Date().toISOString()
        });

        response.statusCode = HTTP_STATUS_CODES.OK;
        response.message = MESSAGE.SUCCESSFUL;
        response.data = {
          updatedCount: bulkResult.modifiedCount,
          matchedCount: bulkResult.matchedCount,
          courseId: courseId,
          message: 'Lesson order updated successfully',
          performance: {
            wordsProcessed: words.length,
            actuallyModified: bulkResult.modifiedCount,
            operationType: 'bulkWrite'
          }
        };

      } catch (error: any) {
        console.error('Error updating lesson order:', error);

        // Handle specific bulkWrite errors
        if (error?.name === 'BulkWriteError') {
          console.error('BulkWrite operation failed:', {
            writeErrors: error.writeErrors || [],
            writeConcernErrors: error.writeConcernErrors || [],
            insertedCount: error.insertedCount || 0,
            matchedCount: error.matchedCount || 0,
            modifiedCount: error.modifiedCount || 0
          });

          response.statusCode = HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;
          response.message = `Bulk update partially failed. Modified: ${error.modifiedCount || 0}/${words.length} words.`;
        } else {
          response.statusCode = HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;
          response.message = 'Database error while updating lesson order.';
        }
      }
    },
  });
};

export default endpoint;
