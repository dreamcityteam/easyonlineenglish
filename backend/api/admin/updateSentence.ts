import { Response } from 'express';
import { catchTry, connectToDatabase } from '../../tools/functions';
import { HTTP_STATUS_CODES } from '../../tools/consts';
import { RequestType } from '../../tools/type';
import CourseWord from '../../schemas/courseWord.schema';

interface UpdateSentenceRequest {
  wordId: string;
  sentenceIndex: number;
  englishWord?: string;
  spanishTranslation?: string;
}

const endpoint = async (req: RequestType, res: Response) => {
  await catchTry({
    res,
    message: 'Error updating sentence',
    endpoint: async (response) => {
      await connectToDatabase();

      // Enhanced logging for Vercel debugging
      console.log('=== UPDATE SENTENCE ENDPOINT ===');
      console.log('Request method:', req.method);
      console.log('Request headers:', req.headers);
      console.log('Request body type:', typeof req.body);
      console.log('Request body:', req.body);
      console.log('Request body stringified:', JSON.stringify(req.body));

      // Handle different body parsing scenarios in Vercel
      let body = req.body;

      if (!body || typeof body !== 'object') {
        console.log('Body is not an object, attempting to parse...');
        if (typeof body === 'string') {
          try {
            body = JSON.parse(body);
          } catch (e) {
            console.error('Failed to parse body as JSON:', e);
          }
        }
      }

      const { wordId, sentenceIndex, englishWord, spanishTranslation }: UpdateSentenceRequest = body || {};

      // Validate input
      if (!wordId || sentenceIndex === undefined) {
        console.log('Validation failed:', { wordId, sentenceIndex, body });
        response.statusCode = HTTP_STATUS_CODES.BAD_REQUEST;
        response.message = 'wordId and sentenceIndex are required.';
        return;
      }

      if (!englishWord && !spanishTranslation) {
        response.statusCode = HTTP_STATUS_CODES.BAD_REQUEST;
        response.message = 'At least one field (englishWord or spanishTranslation) must be provided.';
        return;
      }

      // Find the word first to validate it exists and get current sentences
      const word = await CourseWord.findById(wordId);
      
      if (!word) {
        response.statusCode = HTTP_STATUS_CODES.NOT_FOUND;
        response.message = 'Word not found.';
        return;
      }

      // Validate sentence index
      if (sentenceIndex < 0 || sentenceIndex >= word.sentences.length) {
        response.statusCode = HTTP_STATUS_CODES.BAD_REQUEST;
        response.message = 'Invalid sentence index.';
        return;
      }

      // Prepare update object
      const updateFields: any = {};
      
      if (englishWord !== undefined) {
        updateFields[`sentences.${sentenceIndex}.englishWord`] = englishWord.trim();
      }
      
      if (spanishTranslation !== undefined) {
        updateFields[`sentences.${sentenceIndex}.spanishTranslation`] = spanishTranslation.trim();
      }

      // Add updatedAt timestamp
      updateFields.updatedAt = new Date();

      // Update the specific sentence
      const updatedWord = await CourseWord.findByIdAndUpdate(
        wordId,
        { $set: updateFields },
        { new: true, runValidators: true }
      );

      if (!updatedWord) {
        response.statusCode = HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;
        response.message = 'Failed to update sentence.';
        return;
      }

      // Log the update for audit purposes
      console.log(`Sentence updated for word ${wordId}:`, {
        sentenceIndex,
        updatedFields: updateFields,
        timestamp: new Date().toISOString()
      });

      response.statusCode = HTTP_STATUS_CODES.OK;
      response.message = 'Sentence updated successfully.';
      response.data = {
        wordId,
        sentenceIndex,
        updatedSentence: updatedWord.sentences[sentenceIndex]
      };
    }
  });
};

export default endpoint;
