import { Field } from '../../../components/Form/type';
import { MESSAGE, REGEXP } from '../../../tools/constant';

type Inputs = {
  password: Field;
};

const inputs: Inputs = {
  password: {
    label: 'Contraseña nueva',
    type: 'password',
    placeholder: 'Escriba su contraseña nueva.',
    validation: {
      message: MESSAGE.PASSWORD,
      regExp: REGEXP.PASSWORD,
    },
  },
};

export {
  inputs
};
