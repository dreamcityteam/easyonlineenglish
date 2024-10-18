import { Response } from 'express';
import { Field } from './type';
import {
  HTTP_STATUS_CODES,
  MESSAGE,
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
  getToken,
  send,
  setCookie,
  hash,
  getResponse,
  formatPhoneNumber
} from '../../tools/functions';

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

    if (user) {
      const { password, createdAt, updatedAt, ...data } = user.toObject();

      setCookie({ res, value: getToken({ _id: user._id }) });

      response.statusCode = HTTP_STATUS_CODES.OK;
      response.message = MESSAGE.SUCCESSFUL;
      response.data = data;
    } else {
      response.message = 'Error saving user!';
      response.statusCode = HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;
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
