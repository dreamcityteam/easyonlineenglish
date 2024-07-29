const multer = require('multer');
const { del } = require('@vercel/blob');
const { HTTP_STATUS_CODES, MESSAGE } = require('../../tools/const');
const { getResponse, send, uploadBlodToVercel } = require('../../tools/functions');
const connectToDatabase = require('../../db');
const User = require('../../schemas/user.schema');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

module.exports = (req, res) => {
  const response = getResponse(res);

  upload.single('photo')(req, res, async (err) => {
    if (err) {
      response.statusCode = HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;
      response.message = `Error uploading file! ${err}`;

      return send(response);
    }

    try {
      await connectToDatabase();

      const user = await User.findOne({ _id: req.user.id });

      if (user && user.photo) {
        await del(user.photo);
      }

      const url = await uploadBlodToVercel({
        file: req.file.buffer,
        filename: `user-profile/${req.query.filename}`
      });

      const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        {
          $set: { photo: url },
          $currentDate: {
            updatedAt: true
          }
        },
        { new: true }
      );

      if (!updatedUser) {
        response.statusCode = HTTP_STATUS_CODES.NOT_FOUND;
        response.message = 'User not found!';

        return send(response);
      }

      response.statusCode = HTTP_STATUS_CODES.OK;
      response.message = MESSAGE.SUCCESSFUL;
      response.data = url;
    } catch (error) {
      response.statusCode = HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;
      response.message = `Error saving user! ${error}`;
    }

    send(response);
  });
};
