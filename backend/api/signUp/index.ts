import { Response } from 'express';
import { Field } from './type';
import {
  HTTP_STATUS_CODES,
  VALIDATOR
} from '../../tools/consts';
import {
  ObjectValueString,
  RequestType,
  ResponseSend
} from '../../tools/type';
import User from '../../schemas/user.schema';
import {
  connectToDatabase,
  send,
  hash,
  getResponse,
  formatPhoneNumber,
  getToken,
  sendEmail,
  getLink
} from '../../tools/functions';
import UserToken from '../../schemas/userToken.schema';
import { getEmailTemplate } from './functions';

const endpoint = async (req: RequestType, res: Response) => {
  const response: ResponseSend = getResponse(res, 'Validation failed, please check your input and try again.');
  let invalidFields: ObjectValueString = {};

  const {
    name = '',
    lastname = '',
    email = '',
    phone = '',
    password = '',
    username = ''
  } = req.body;

  const fields: Field[] = [
    { key: 'username', value: username, validator: VALIDATOR.USERNAME },
    { key: 'name', value: name, validator: VALIDATOR.NAME },
    { key: 'lastname', value: lastname, validator: VALIDATOR.LAST_NAME },
    { key: 'email', value: email, validator: VALIDATOR.EMAIL },
    { key: 'phone', value: phone, validator: VALIDATOR.PHONE_NUMBER },
    { key: 'password', value: password, validator: VALIDATOR.PASSWORD },
  ];

  fields.forEach(({ key, value, validator }: Field): void => {
    if (!validator.regExp.test(value)) {
      invalidFields[key] = validator.message;
    }
  });

  if (invalidFields['phone'] && !phone) {
    delete invalidFields['phone'];
  }

  if (Object.keys(invalidFields).length) {
    response.data = invalidFields;
    return send(response);
  }

  try {
    await connectToDatabase();

    const user = new User({
      email: email.toLowerCase(),
      isActive: false,
      lastname: lastname.toLowerCase(),
      name: name.toLowerCase(),
      password: await hash.create(password),
      phone: formatPhoneNumber(phone),
      username: username.toLowerCase(),
    });

    await user.save();

    const { EMAIL_USER = '' } = process.env;
    const token = getToken({ _id: user._id, type: 'active-account', expiresIn: '1d' });
    const emailConfig = {
      from: EMAIL_USER,
      to: email,
      subject: 'easyonlineenglish - activar cuenta',
      html: getEmailTemplate({
        username: user.username || '',
        supportEmail: EMAIL_USER,
        phone: '+1 (849) 410-9664',
        token: getLink({ req, path: 'active-account', token }),
      })
    };

    if (await sendEmail(emailConfig)) {
      const userToken = new UserToken({
        idUser: user._id,
        token,
        type: 'ACTIVE_ACCOUNT'
      });

      await userToken.save();

      response.message = 'Se ha enviado un correo electrónico de activación.';
      response.statusCode = HTTP_STATUS_CODES.OK;
    } else {
      response.message = 'Error saving user!';
      response.statusCode = HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;

      if (user) await User.findByIdAndDelete(user._id);
    }
  } catch (error) {
    const errorMessage: string = `Error saving user! ${error}`;
    const field: RegExpMatchArray | null = errorMessage.match(/{.*}/);

    if (field && field[0]) {
      invalidFields = JSON.parse(
        field[0]
          .replace(/"[^"]+"/, '"Este campo ya está en uso."')
          .replace(/([{,]\s*)([a-zA-Z0-9_]+)(\s*:)/g, '$1"$2"$3')
      );

      response.data = invalidFields;
    } else {
      response.statusCode = HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;
    }

    response.message = errorMessage;
  }

  return send(response);
};

export default endpoint;
