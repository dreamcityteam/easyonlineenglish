import { Field } from '../../../components/Form/type';
import { MESSAGE, REGEXP } from '../../../tools/constant';

type Inputs = {
  password: Field;
  repeatPassword: Field;
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

  repeatPassword: {
    label: 'Repetir contraseña',
    type: 'password',
    placeholder: 'Escriba su contraseña',
    autoComplete: 'new-password',
    validation: {
      message: MESSAGE.PASSWORD,
      regExp: REGEXP.PASSWORD,
    },
  },
};

export {
  inputs
};
