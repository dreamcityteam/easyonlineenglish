import { Field } from '../../../components/Form/type';
import { REGEXP } from '../../../tools/constant';

type Inputs = {
  password: Field;
  phone: Field;
  name: Field;
  lastname: Field;
  oldPassword: Field;
};

const inputs = ({ name, lastname, phone }: any): Inputs => ({
  name: {
    label: 'Nombre',
    type: 'text',
    value: name,
    placeholder: 'Escriba su nombre.',
    validation: {
      message: 'Por favor, introduzca un nombre válido.',
      regExp: REGEXP.NAME,
    },
  },

  lastname: {
    label: 'Apellido',
    type: 'text',
    value: lastname,
    placeholder: 'Escriba su apellido.',
    validation: {
      message: 'Por favor, introduzca un apellido válido.',
      regExp: REGEXP.LAST_NAME,
    },
  },

  phone: {
    label: 'Teléfono (opcional)',
    type: 'number',
    placeholder: 'Escriba su teléfono.',
    value: phone,
    validation: {
      message: 'Por favor, introduzca un número de teléfono.',
      regExp: REGEXP.PHONE_NUMBER,
      isOpcional: true
    },
  },

  oldPassword: {
    label: 'Contraseña vieja',
    type: 'password',
    placeholder: 'Escriba su contraseña vieja.',
    validation: {
      message: 'Al menos 8 caracteres, una letra y un número.',
      regExp: REGEXP.PASSWORD,
      isOpcional: true
    },
  },

  password: {
    label: 'Contraseña nueva',
    type: 'password',
    placeholder: 'Escriba su contraseña nueva.',
    validation: {
      message: 'Al menos 8 caracteres, una letra y un número.',
      regExp: REGEXP.PASSWORD,
      isOpcional: true
    },
  },
});

export {
  inputs
}