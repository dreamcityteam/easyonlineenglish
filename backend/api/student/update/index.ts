import { Response } from 'express';
import { catchTry, hash } from '../../../tools/functions';
import { HTTP_STATUS_CODES, MESSAGE, VALIDATOR } from '../../../tools/consts';
import { ObjectValueString, RequestType } from '../../../tools/type';
import { Field } from '../../signUp/type';
import User from '../../../schemas/user.schema';

const endpoint = async (req: RequestType, res: Response) => {
  catchTry({
    res,
    message: 'User not found!',
    endpoint: async (response) => {
      const { _id } = req.user;
      const {
        name = '',
        lastname = '',
        phone = '',
        password = '',
        oldPassword
      } = req.body;

      const fields: Field[] = [
        { key: 'name', value: name, validator: VALIDATOR.NAME },
        { key: 'lastName', value: lastname, validator: VALIDATOR.LAST_NAME },
        { key: 'phone', value: phone, validator: VALIDATOR.PHONE_NUMBER },
      ];

      const invalidFields: ObjectValueString = {};

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
        return;
      }

      const user = await User.findById(_id);

      if (!user) return;

      if (oldPassword || password) {
        // Compare oldPassword with hashed password stored in the database
        const passwordMatch = await hash.compare({ password: oldPassword, hash: user.password || '' });

        if (!passwordMatch) {
          response.statusCode = HTTP_STATUS_CODES.UNAUTHORIZED;
          response.message = 'Incorrect old password.';
          response.data = { oldPassword: 'Incorrect old password.' };
          return;
        }
      }

      // Update user
      const updatedUser = await User.findByIdAndUpdate(
        _id,
        {
          $set: {
            name: name.toLowerCase(),
            lastname: lastname.toLowerCase(),
            phone,
            ...(password && oldPassword ? { password: await hash.create(password) } : {}),
          },
          $currentDate: {
            updatedAt: true
          }
        },
        { new: true }
      );

      response.statusCode = HTTP_STATUS_CODES.OK;
      response.message = MESSAGE.SUCCESSFUL;
      response.data = updatedUser;
    }
  });
};

export default endpoint;
