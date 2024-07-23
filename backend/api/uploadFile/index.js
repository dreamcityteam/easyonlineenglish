const multer = require('multer');
const sharp = require('sharp');
const { HTTP_STATUS_CODES, MESSAGE } = require('../../tools/const');
const { getResponse, send } = require('../../tools/functions');
const { put } = require('@vercel/blob');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

module.exports = (req, res) => {
  const response = getResponse(res);
  const filename = req.query.filename;

  upload.single('photo')(req, res, async (err) => {
    if (err) {
      response.statusCode = HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;
      response.message = `Error uploading file! ${err}`;
      return send(response);
    }

    try {
      const resizedImage = await sharp(req.file.buffer)
        .resize(192, 192)
        .toBuffer();

      const blob = await put(filename, req.file.buffer, {
        access: 'public',
      });

      response.statusCode = HTTP_STATUS_CODES.OK;
      response.message = MESSAGE.SUCCESSFUL;
      response.data = blob;
      send(response);
    } catch (error) {
      response.statusCode = HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;
      response.message = `Error saving user! ${error}`;
      send(response);
    }
  });
};
