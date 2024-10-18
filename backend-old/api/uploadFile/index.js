const multer = require('multer');
const { HTTP_STATUS_CODES, MESSAGE } = require('../../tools/const');
const { getResponse, send, uploadBlodToVercel } = require('../../tools/functions');

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
      response.statusCode = HTTP_STATUS_CODES.OK;
      response.message = MESSAGE.SUCCESSFUL;
      response.data = await uploadBlodToVercel({
        file: req.file.buffer,
        filename: req.query.filename
      });
    } catch (error) {
      response.statusCode = HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;
      response.message = `Error saving user! ${error}`;
    }

    send(response);
  });
};
