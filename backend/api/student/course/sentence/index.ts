import { Response } from 'express';
import { catchTry, connectToDatabase } from '../../../../tools/functions';
import { HTTP_STATUS_CODES, MESSAGE } from '../../../../tools/consts';
import { RequestType } from '../../../../tools/type';
import StudentCourse from '../../../../schemas/studentCourse.schema';

const endpoint = async (req: RequestType, res: Response) => {
  catchTry({
    res,
    message: 'Invalid course.',
    endpoint: async (response) => {
      const { idStudentCourse, index } = req.body;

      await connectToDatabase();
  
      // Update the student course
      const studentCourse = await StudentCourse.findOneAndUpdate(
        { _id: idStudentCourse },
        { $set: { 'index.sentence': index } },
        { new: true }
      );
  
      // Check if the student course was successfully updated
      if (studentCourse) {
        response.message = MESSAGE.SUCCESSFUL;
        response.statusCode = HTTP_STATUS_CODES.OK;
        response.data = null;
      } else {
        response.message = 'Error updating student course.';
        response.statusCode = HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;
      }
    }
  });
};

export default endpoint;
