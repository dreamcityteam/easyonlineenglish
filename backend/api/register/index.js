const { getResponse, getToken, send, setCookie, hash } = require('../../tools/functions');
const { formatPhoneNumber } = require('./functions');
const { REGEXP, HTTP_STATUS_CODES } = require('../../tools/const');
const connectToDatabase = require('../../db');
const User = require('../../schemas/user.schema');

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

    const user = await newUser.save();
    setCookie({ res, value: getToken({ id: user._id }) });
    response.statusCode = HTTP_STATUS_CODES.OK;
    response.message = 'Registration successful!';
    response.data = user;
  } catch (error) {
    response.statusCode = HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;
    response.message = `Error saving user! ${error}`;
  }

  send(response);
};

