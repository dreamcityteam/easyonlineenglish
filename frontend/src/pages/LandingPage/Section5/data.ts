import { Fields } from '../../../components/Form/type';
import { VALIDATOR } from '../../../tools/constant';

const inputs: Fields = {
  email: {
    placeholder: 'Tu correo electrónico',
    type: 'email',
    validator: VALIDATOR.EMAIL,
  },
};

export {
  inputs
};
