import { Response } from 'express';
import { catchTry, connectToDatabase } from '../../../tools/functions';
import { HTTP_STATUS_CODES, MESSAGE } from '../../../tools/consts';
import { RequestType } from '../../../tools/type';
import Course from '../../../schemas/course.schema';
import StudentCourse from '../../../schemas/studentCourse.schema';

const endpoint = async (req: RequestType, res: Response) => {
  catchTry({
    res,
    message: 'There are no courses available',
    endpoint: async (response) => {
      await connectToDatabase();

      let courses = await Course.find().lean().select({ __v: 0 });
  
      if (courses.length > 0) {
        courses = await Promise.all(courses.map(async (course) => {
          const studentCourse = await StudentCourse.findOne({ idCourse: course._id, idUser: req.user._id }).lean();
          return studentCourse ? { ...course, progress: studentCourse.progress } : course;
        }));
  
        response.data = courses;
        response.statusCode = HTTP_STATUS_CODES.OK;
        response.message = MESSAGE.SUCCESSFUL;
      }
    }
  });
};

export default endpoint;
