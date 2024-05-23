import { Inputs, Info } from './type';
import { REGEXP } from '../../../tools/constant';

const infos: Info[] = [
  {
    googleId: '1P2H5fYPO1z9HzTWYKulQy1AkfpTru6O4',
    title: 'Llamanos 24/7',
    info: '+1 (849) 410-9664',
  },
  {
    googleId: '1ukYO8aBYl_kNArkX_hVV2AQlZtaS755P',
    title: 'Envienos un Correo',
    info: 'support@easyonlineenglish.com',
  },
  {
    googleId: '1tMnbRX85F_5DQFDyvz-GeADNXU4tbQJE',
    title: 'Nuestra Sede',
    info: 'República Dominicna',
  }
];

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
  inputs,
  infos,
}
