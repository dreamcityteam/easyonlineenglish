import { Response } from 'express';
import { catchTry, connectToDatabase, uploadBlodToVercel } from '../../../tools/functions';
import { HTTP_STATUS_CODES, MESSAGE } from '../../../tools/consts';
import { RequestType } from '../../../tools/type';
import User from '../../../schemas/user.schema';
import multer from 'multer';
import { del } from '@vercel/blob';

const storage: multer.StorageEngine = multer.memoryStorage();
const upload: multer.Multer = multer({ storage: storage });

const endpoint = async (req: RequestType, res: Response) => {
  upload.single('photo')(req, res, async (err) => {
    catchTry({
      res,
      message: 'User not found!',
      endpoint: async (response) => {
        if (err) {
          response.statusCode = HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;
          response.message = `Error uploading file! ${err}`;
    
          return;
        }

        await connectToDatabase();

        const { _id = '' } = req.user;
        const user = await User.findOne({ _id });

        if (user && user.photo) {
          await del(user.photo);
        }
  
        const url = await uploadBlodToVercel({
          file: req.file?.buffer,
          filename: `user-profile/${req.query.filename}`
        });
  
        const updatedUser = await User.findByIdAndUpdate(
          _id,
          {
            $set: { photo: url },
            $currentDate: {
              updatedAt: true
            }
          },
          { new: true }
        );
  
        if (!updatedUser) return;
  
        response.statusCode = HTTP_STATUS_CODES.OK;
        response.message = MESSAGE.SUCCESSFUL;
        response.data = url;
      }
    });
  });
};

export default endpoint;
