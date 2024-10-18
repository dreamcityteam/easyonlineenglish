import { Fields } from '../../../components/Form/type';
import { VALIDATOR } from '../../../tools/constant';

const inputs: Fields = {
  username: {
    label: 'Nombre de usuario',
    type: 'text',
    placeholder: 'Escriba su nombre de usuario.',
    validator: VALIDATOR.USERNAME
  },

  name: {
    label: 'Nombre',
    type: 'text',
    placeholder: 'Escriba su nombre.',
    validator: VALIDATOR.NAME
  },

  lastname: {
    label: 'Apellido',
    type: 'text',
    placeholder: 'Escriba su apellido.',
    validator: VALIDATOR.LASTNAME
  },

  email: {
    label: 'Email',
    type: 'email',
    placeholder: 'Escriba su email.',
    validator: VALIDATOR.EMAIL
  },

  phone: {
    label: 'Teléfono',
    type: 'tel',
    placeholder: 'Escriba su teléfono.',
    validator: VALIDATOR.PHONE_NUMBER,
  },

  password: {
    label: 'Contraseña',
    type: 'password',
    placeholder: 'Escriba su contraseña.',
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
