const { getResponse, getToken, send, sendEmail, hash } = require('../../tools/functions');
const { formatPhoneNumber, getEmailTemplate } = require('./functions');
const { REGEXP, HTTP_STATUS_CODES } = require('../../tools/const');
const connectToDatabase = require('../../db');
const User = require('../../schemas/user.schema');

const getLink = ({ req, token, path }) =>
  `${req.protocol}://${req.get('host')}/${path}/${token}`;

module.exports = async (req, res) => {
  const {
    username = '', name = '', lastname = '',
    email = '', phone = '', password = ''
  } = req.body;
  const response = getResponse(res);
  const invalidFields = {};

  // Validate each field against its corresponding regular expression
  if (!REGEXP.USERNAME.test(username)) {
    invalidFields['username'] = 'Por favor, introduzca un nombre de usuario válido.';
  }

  if (!REGEXP.NAME.test(name)) {
    invalidFields['name'] = 'Por favor, introduzca un nombre válido.';
  }

  if (!REGEXP.LAST_NAME.test(lastname)) {
    invalidFields['lastname'] = 'Por favor, introduzca un apellido válido.';
  }

  if (!REGEXP.EMAIL.test(email)) {
    invalidFields['email'] = 'Por favor, introduzca una dirección de correo electrónico válida.';
  }

  if (!REGEXP.PHONE_NUMBER.test(phone)) {
    invalidFields['phone'] = 'Por favor, introduzca un número de teléfono válido.';
  }

  if (!REGEXP.PASSWORD.test(password)) {
    invalidFields['password'] = 'La contraseña debe tener al menos 8 caracteres, una letra y un número.';
  }

  if (Object.keys(invalidFields).length) {
    response.data = invalidFields;
    response.message = 'Invalid field: Please ensure all required fields are completed accurately.';
    return send(response);
  }

  let user;

  try {
    await connectToDatabase();

    const newUser = new User({
      username: username.toLowerCase(),
      name: name.toLowerCase(),
      lastname: lastname.toLowerCase(),
      email: email.toLowerCase(),
      phone: formatPhoneNumber(phone),
      password: await hash.create(password),
    });

    user = await newUser.save();

    const type = 'active-account';
    const { EMAIL_USER = '' } = process.env;
    const token = getToken({ id: user._id, type, expiresIn: '1d' });

    const emailConfig = {
      from: EMAIL_USER,
      to: email,
      subject: 'easyonlineenglish - activar cuenta',
      html: getEmailTemplate({
        username: user.username,
        supportEmail: EMAIL_USER,
        telefono: '+1 (849) 410-9664',
        token: getLink({ req, path: type, token }),
      })
    };

    if (await sendEmail(emailConfig)) {
      response.message = 'Se ha enviado un correo electrónico de activación.';
      response.statusCode = HTTP_STATUS_CODES.OK;
    } else {
      response.message = 'Ups, ocurrió un error. Por favor, inténtalo de nuevo más tarde.';
      response.statusCode = HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;

      if (user) await User.findByIdAndDelete(user._id);
    }
  } catch (error) {
    response.statusCode = HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;
    response.message = `Error saving user! ${error}`;

    if (user) await User.findByIdAndDelete(user._id);
  }

  send(response);
};

