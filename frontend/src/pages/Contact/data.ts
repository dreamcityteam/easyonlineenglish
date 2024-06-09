import { Inputs } from './type';
import { REGEXP } from '../../tools/constant';

const inputs: Inputs = {
  name: {
    label: 'Nombre',
    placeholder: 'Escriba su nombre',
    validation: {
      message: 'Please enter a valid name.',
      regExp: REGEXP.NAME,
    },
  },

  email: {
    label: 'Email',
    placeholder: 'Escriba su correo electrónico',
    validation: {
      message: 'Por favor, introduzca una dirección de correo válida.',
      regExp: REGEXP.EMAIL,
    },
  },

  subject: {
    label: 'Subject',
    placeholder: 'Escriba su asunto',
  },

  message: {
    label: 'Mensaje',
    type: 'textarea',
    placeholder: 'Escriba su message',
  },
};

export {
  inputs
}
