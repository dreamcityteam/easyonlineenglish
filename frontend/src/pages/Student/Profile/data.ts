import { Fields } from '../../../components/Form/type';
import { VALIDATOR } from '../../../tools/constant';

const PLAN: any = {
  '1': '1 MES',
  '2': '1 AÑO',
  '3': '3 MES'
};

const inputs = ({ name, lastname, phone }: any): Fields => ({
  name: {
    label: 'Nombre',
    type: 'text',
    value: name,
    placeholder: 'Escriba su nombre.',
    validator: VALIDATOR.NAME,
  },

  lastname: {
    label: 'Apellido',
    type: 'text',
    value: lastname,
    placeholder: 'Escriba su apellido.',
    validator: VALIDATOR.LASTNAME,
  },

  phone: {
    label: 'Teléfono',
    type: 'tel',
    placeholder: 'Escriba su teléfono.',
    value: phone.replace(/\W/g, ''),
    validator: VALIDATOR.PHONE_NUMBER,
    avoidEmptyField: true
  },

  oldPassword: {
    label: 'Contraseña vieja',
    type: 'password',
    placeholder: 'Escriba su contraseña vieja.',
    validator: VALIDATOR.PASSWORD,
    avoidEmptyField: true
  },

  password: {
    label: 'Contraseña nueva',
    type: 'password',
    placeholder: 'Escriba su contraseña nueva.',
    autocomplete: 'new-password',
    validator: VALIDATOR.PASSWORD,
    avoidEmptyField: true
  },
});

export {
  inputs,
  PLAN
}