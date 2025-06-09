import { Fields } from '../../components/Form/type';
import { VALIDATOR } from '../../tools/constant';
import { Info } from './type';

const inputs: Fields = {
  name: {
    label: 'Nombre',
    placeholder: 'Escriba su nombre',
    type: 'text',
    validator: VALIDATOR.NAME,
  },

  email: {
    label: 'Email',
    placeholder: 'Escriba su correo electrónico',
    type: 'text',
    validator: VALIDATOR.EMAIL,
  },

  subject: {
    label: 'Subject',
    placeholder: 'Escriba su asunto',
    type: 'text',
  },

  message: {
    label: 'Mensaje',
    placeholder: 'Escriba su message',
    type: 'textarea',
  },
};

const infos: Info[] = [
  {
    alt: 'Phone',
    description: '+1 (849) 505-8393',
    path: 'icons/phone-s59rhmvyjSlbehTTOUQwJ6039yBCO0.jpg',
    title: 'Teléfono',
  },
  {
    alt: 'Email',
    description: 'support@easyonlineenglish.com',
    path: 'icons/email-Kwptk8RyxQ3bnzsQTrfBmJGqJXrv8X.jpg',
    title: 'Correo',
  },
  {
    alt: 'Location',
    description: 'Cabarete, Puerto Plata, República Dominicana.',
    path: 'icons/location-EI0CinXiIt2tUHQywL0XLoD0r2CmTP.jpg',
    title: 'Localización',
  }
];

export {
  inputs,
  infos
}
