import { Field } from '../../../components/Form/type';
import { MESSAGE, REGEXP } from '../../../tools/constant';

type Inputs = {
  password: Field;
  phone: Field;
  name: Field;
  lastname: Field;
  oldPassword: Field;
};

const PLAN: any = {
  '1': '1 MES',
  '2': '1 AÑO',
  '3': '3 MES'
}

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
    label: 'Teléfono',
    type: 'number',
    placeholder: 'Escriba su teléfono.',
    value: phone.replace(/\W/g, ''),
    validation: {
      message: 'Por favor, introduzca un número de teléfono.',
      regExp: REGEXP.PHONE_NUMBER,
    },
  },

  oldPassword: {
    label: 'Contraseña vieja',
    type: 'password',
    placeholder: 'Escriba su contraseña vieja.',
    validation: {
      message: MESSAGE.PASSWORD,
      regExp: REGEXP.PASSWORD,
      isOpcional: true
    },
  },

  password: {
    label: 'Contraseña nueva',
    type: 'password',
    placeholder: 'Escriba su contraseña nueva.',
    autoComplete: 'new-password',
    validation: {
      message: MESSAGE.PASSWORD,
      regExp: REGEXP.PASSWORD,
      isOpcional: true
    },
  },
});

export {
  inputs,
  PLAN
}