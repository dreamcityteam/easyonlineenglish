import { Info, Inputs } from './type';
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

const infos: Info[] = [
  {
    path: 'icons/phone-SdeywUetntw1CxsoJbOPwI3oFumj2J.avif',
    alt: 'Phone',
    title: 'Teléfono',
    description: '+1 (849) 410-9664'
  },
  {
    path: 'icons/email-jNdh3RwRu4df5LmIYENJtnpGq0h3QG.avif',
    alt: 'Email',
    title: 'Correo',
    description: 'support@easyonlineenglish.com'
  },
  {
    path: 'icons/location-FZAyKeKVwsTA89nlrrPndy8HU0s9A2.avif',
    alt: 'Location',
    title: 'Localización',
    description: 'Cabarete, Puerto Plata, República Dominicana.'
  }
];

export {
  inputs,
  infos
}
