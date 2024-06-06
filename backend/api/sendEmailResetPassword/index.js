const { getResponse, send, sendEmail, getToken } = require('../../tools/functions');
const { HTTP_STATUS_CODES } = require('../../tools/constant');
const connectToDatabase = require('../../db');
const User = require('../../schemas/user.schema');
const UserToken = require('../../schemas/userToken.schema');

const getLink = (req, token) =>
  `${req.protocol}://${req.get('host')}/reset-password-auth/${token}`;

module.exports = async (req, res) => {
  const response = getResponse(res);

  try {
    await connectToDatabase();

    const { email = '' } = req.body;
    const { EMAIL_USER = '' } = process.env;
    const user = await User.findOne({ email }).select({ __v: 0 });
    const userToken = await UserToken.findOne({ idUser: user._id }).select({ __v: 0 });
    const token = getToken({ id: user._id, expiresIn: '2m' });

    if (!userToken) {
      const userToken = new UserToken({ idUser: user._id, token });
      await userToken.save();
    } else {
      await UserToken.findOneAndUpdate(
        { idUser: user._id },
        { $set: { token } },
      );   
    }

    const emailConfig = {
      from: EMAIL_USER,
      to: email,
      subject: 'easyonlineenglish - reset password',
      html: `<a href="${getLink(req, token)}"> Link </a>`,
    };

    if (await sendEmail(emailConfig)) {
      response.message = 'Email sent successfully';
      response.statusCode = HTTP_STATUS_CODES.OK;
    } else {
      response.message = `Error sending email: ${error}`;
      response.statusCode = HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;
    }
  } catch (error) {
    const newError = `${error}`.includes("reading '_id'")
      ? 'El correo electrónico no existe.'
      : `Error saving user! ${error}`;

    response.message = newError;
    response.statusCode = HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;
  }

  send(response);
};
