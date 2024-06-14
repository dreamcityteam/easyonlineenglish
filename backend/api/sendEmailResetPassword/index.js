const { getResponse, send, sendEmail, getToken } = require('../../tools/functions');
const { HTTP_STATUS_CODES } = require('../../tools/const');
const connectToDatabase = require('../../db');
const User = require('../../schemas/user.schema');
const UserToken = require('../../schemas/userToken.schema');
const { getEmailTemplate } = require('./function');

const getLink = (req, token) =>
  `${req.protocol}://${req.get('host')}/reset-password-auth/${token}`;

module.exports = async (req, res) => {
  const response = getResponse(res);

  try {
    await connectToDatabase();

    const { email = '' } = req.body;
    const { EMAIL_USER = '' } = process.env;
    const user = await User.findOne({ email }).select({ __v: 0 });

    if (!user) {
      response.message = 'El correo electrónico no existe.';
      response.statusCode = HTTP_STATUS_CODES.NOT_FOUND;

      return send(response);
    }

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
      subject: 'easyonlineenglish - Contraseña',
      html: getEmailTemplate({
        token: getLink(req, token),
        username: user.username,
        supportEmail: EMAIL_USER,
        telefono: '+1 (849) 410-9664'
      })
    };

    if (await sendEmail(emailConfig)) {
      response.message = 'Se ha enviado un correo electrónico de verificación.';
      response.statusCode = HTTP_STATUS_CODES.OK;
    } else {
      response.message = 'Ups, ocurrió un error. Por favor, inténtalo de nuevo más tarde.';
      response.statusCode = HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;
    }
  } catch (error) {
    response.message = 'Ups, ocurrió un error. Por favor, inténtalo de nuevo más tarde.';
    response.statusCode = HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;
  }

  send(response);
};
