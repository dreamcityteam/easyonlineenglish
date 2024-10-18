const { HTTP_STATUS_CODES, MESSAGE } = require('../../tools/const');
const { getResponse, send } = require('../../tools/functions');
const connectToDatabase = require('../../db');
const Library = require('../../schemas/library.schema');

module.exports = async (_, res) => {
  const response = getResponse(res);

  try {
    await connectToDatabase();

    const libraries = await Library.find().select({ __v: 0 });

    response.statusCode = HTTP_STATUS_CODES.OK;
    response.message = MESSAGE.SUCCESSFUL;
    response.data = libraries;
  } catch (error) {
    response.statusCode = HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;
    response.message = `Error saving user! ${error}`;
  }

  send(response);
};
