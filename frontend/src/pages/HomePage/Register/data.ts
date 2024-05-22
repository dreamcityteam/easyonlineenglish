import { Field } from '../../../components/Form/type';
import { REGEXP } from '../../../tools/constant';

type Inputs = {
  username: Field;
  email: Field;
  password: Field;
  phone: Field;
  name: Field;
  lastname: Field;
};

const inputs: Inputs = {
  username: {
    label: 'Nombre de usuario',
    type: 'text',
    placeholder: 'Escriba su nombre de usuario.',
    validation: {
      message: 'Por favor, introduzca un nombre de usuario válido.',
      regExp: REGEXP.USERNAME,
    },
  },

  name: {
    label: 'Nombre',
    type: 'text',
    placeholder: 'Escriba su nombre.',
    validation: {
      message: 'Por favor, introduzca un nombre válido.',
      regExp: REGEXP.NAME,
    },
  },

  lastname: {
    label: 'Apellido',
    type: 'text',
    placeholder: 'Escriba su apellido.',
    validation: {
      message: 'Por favor, introduzca un apellido válido.',
      regExp: REGEXP.LAST_NAME,
    },
  },

  email: {
    label: 'Email',
    type: 'email',
    placeholder: 'Escriba su email.',
    validation: {
      message: 'Por favor, introduzca una dirección de correo electrónico válida.',
      regExp: REGEXP.EMAIL,
    },
  },

  phone: {
    label: 'Teléfono (opcional)',
    type: 'number',
    placeholder: 'Escriba su teléfono.',
    validation: {
      message: 'Por favor, introduzca un número de teléfono.',
      regExp: REGEXP.PHONE_NUMBER,
      isOpcional: true
    },
  },

  password: {
    label: 'Contraseña',
    type: 'password',
    placeholder: 'Escriba su contraseña',
    validation: {
      message: 'Al menos 8 caracteres, una letra y un número.',
      regExp: REGEXP.PASSWORD,
    },
  },
};

export {
  inputs
}