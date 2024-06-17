const { HTTP_STATUS_CODES } = require('../../tools/const');
const { getResponse, send } = require('../../tools/functions');
const connectToDatabase = require('../../db');
const StudentPayment = require('../../schemas/studentPayment.schema');

module.exports = async (req, res) => {
  const response = getResponse(res);

  try {
    await connectToDatabase();

    const studentPayment = await StudentPayment
      .find({ idUser: req.user.id })
      .select({ 
        __v: 0,
        _id: 0,
        azulCustomOrderId: 0,
        azulOrderId: 0,
        azulRRN: 0,
        azulTicket: 0,
        idUse: 0,
        idUser: 0,
        name: 0,
      })
      .sort({ _id: -1 });

    response.statusCode = HTTP_STATUS_CODES.OK;
    response.message = 'Registration successful!';
    response.data = studentPayment;
  } catch (error) {
    response.statusCode = HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;
    response.message = `Error saving user! ${error}`;
  }

  send(response);
};
