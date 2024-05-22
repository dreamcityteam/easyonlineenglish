const { HTTP_STATUS_CODES } = require('../../tools/constant');
const { getResponse, send } = require('../../tools/functions');
const Library = require('../../schemas/library.schema');

module.exports = async (req, res) => {
  const response = getResponse(res);

  try {
    const libraries = await Library.find().select({ __v: 0 });

    response.statusCode = HTTP_STATUS_CODES.OK;
    response.message = 'Registration successful!';
    response.data = libraries;
  } catch (error) {
    response.statusCode = HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;
    response.message = `Error saving user! ${error}`;
  }

  send(response);
};
