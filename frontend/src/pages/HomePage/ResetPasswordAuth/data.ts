import { Field } from '../../../components/Form/type';
import { REGEXP } from '../../../tools/constant';

type Inputs = {
  password: Field;
};

const inputs: Inputs = {
  password: {
    label: 'Contraseña nueva',
    type: 'password',
    placeholder: 'Escriba su contraseña nueva.',
    validation: {
      message: 'Al menos 8 caracteres, una letra y un número.',
      regExp: REGEXP.PASSWORD,
    },
  },
};

export {
  inputs
};
