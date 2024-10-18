import { Fields } from '../../../components/Form/type';
import { VALIDATOR } from '../../../tools/constant';

const inputs: Fields = {
  password: {
    label: 'Contraseña nueva',
    type: 'password',
    placeholder: 'Escriba su contraseña nueva.',
    autocomplete: 'new-password',
    validator: VALIDATOR.PASSWORD,
  },

  repeatPassword: {
    label: 'Repetir contraseña',
    type: 'password',
    placeholder: 'Escriba su contraseña.',
    autocomplete: 'new-password',
    validator: VALIDATOR.PASSWORD,
  },
};

export {
  inputs
};
