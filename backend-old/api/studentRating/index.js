const { getResponse, send, sendEmail } = require('../../tools/functions');
const { HTTP_STATUS_CODES, MESSAGE } = require('../../tools/const');

module.exports = async (req, res) => {
  const { email, name, lastname, rating, course, lesson } = req.body;
  const response = getResponse(res);
  const { EMAIL_USER = '' } = process.env;
  const emailConfig = {
    from: email,
    to: EMAIL_USER,
    subject: `easyonlineenglish - Rating`,
    html: `
      <p><strong>Lesson: </strong> ${lesson}</p>
      <p><strong>Course name: </strong> ${course}</p>
      <p><strong>Student name: </strong> ${name} ${lastname}</p>
      <p><strong>Student rating: </strong> ${rating}</p>
    `,
  };

  if (await sendEmail(emailConfig)) {
    response.message = MESSAGE.SUCCESSFUL;
    response.statusCode = HTTP_STATUS_CODES.OK;
  } else {
    response.message = `Error sending email`;
    response.statusCode = HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;
  }

  send(response);
};
