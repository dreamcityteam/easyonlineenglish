import { Inputs } from './type';
import { REGEXP } from '../../../tools/constant';

const inputs: Inputs = {
  email: {
    placeholder: 'Tu correo electrónico',
    type: 'email',
    validation: {
      message: 'Por favor, introduzca una dirección de correo válida.',
      regExp: REGEXP.EMAIL,
    },
  },
};

export {
  inputs
}
