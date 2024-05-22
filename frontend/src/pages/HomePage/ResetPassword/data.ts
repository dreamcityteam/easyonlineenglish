import { Field } from '../../../components/Form/type';
import { REGEXP } from '../../../tools/constant';

type Inputs = {
  email: Field;
};
const inputs: Inputs = {
  email: {
    label: 'Email',
    type: 'email',
    placeholder: 'Escriba su email.',
    validation: {
      message: 'Por favor, introduzca una dirección de correo electrónico válida.',
      regExp: REGEXP.EMAIL,
    },
  },
};

export {
  inputs
}