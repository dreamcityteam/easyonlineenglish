import { Fields } from '../../../components/Form/type';
import { VALIDATOR } from '../../../tools/constant';

const inputs: Fields = {
  email: {
    label: 'Email',
    type: 'email',
    placeholder: 'Escriba su email.',
    validator: VALIDATOR.EMAIL,
  },
};

export {
  inputs
};
