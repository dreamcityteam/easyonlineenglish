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
    path: 'icons/phone-s59rhmvyjSlbehTTOUQwJ6039yBCO0.jpg',
    alt: 'Phone',
    title: 'Teléfono',
    description: '+1 (849) 410-9664'
  },
  {
    path: 'icons/email-Kwptk8RyxQ3bnzsQTrfBmJGqJXrv8X.jpg',
    alt: 'Email',
    title: 'Correo',
    description: 'support@easyonlineenglish.com'
  },
  {
    path: 'icons/location-EI0CinXiIt2tUHQywL0XLoD0r2CmTP.jpg',
    alt: 'Location',
    title: 'Localización',
    description: 'Cabarete, Puerto Plata, República Dominicana.'
  }
];

export {
  inputs,
  infos
}
