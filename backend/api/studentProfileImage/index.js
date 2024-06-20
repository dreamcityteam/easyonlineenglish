const multer = require('multer');
const sharp = require('sharp');
const { HTTP_STATUS_CODES, MESSAGE } = require('../../tools/const');
const { getResponse, send } = require('../../tools/functions');
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

      const resizedImage = await sharp(req.file.buffer)
        .resize(192, 192)
        .toBuffer();

      const base64Image = Buffer.from(resizedImage).toString('base64');
      const photo = `data:image/jpeg;base64, ${base64Image}`;

      const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        {
          $set: { photo },
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
      response.data = photo;
      send(response);
    } catch (error) {
      response.statusCode = HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;
      response.message = `Error saving user! ${error}`;
      send(response);
    }
  });
};
