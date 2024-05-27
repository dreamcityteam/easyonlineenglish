const { getResponse, send, sendEmail } = require('../../tools/functions');
const { HTTP_STATUS_CODES } = require('../../tools/constant');

module.exports = async (req, res) => {
  const { name, email, subject, message } = req.body;
  const response = getResponse(res);
  const { EMAIL_USER = '' } = process.env;
  const emailConfig = {
    from: email,
    to: EMAIL_USER,
    subject: `easyonlineenglish - ${subject}`,
    html: `
      <p><strong>Nombre:</strong> ${name}</p>
      <p><strong>Mensaje:</strong> ${message}</p>
    `,
  };

  if (await sendEmail(emailConfig)) {
    response.message = 'Email sent successfully';
    response.statusCode = HTTP_STATUS_CODES.OK;
    send(response);
  } else {
    response.message = `Error sending email`;
    response.statusCode = HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;
    send(response);
  }
};
