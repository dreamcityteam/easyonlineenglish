import React from 'react';
import className from './style.module.sass';
import Image from '../../../../components/Image';

const RegistrationSuccess: React.FC = () => (
  <div className={className.registrationSuccess}>
    <div className={className.registrationSuccess__logo}>
      <Image
        path="logoo-VwZrWBbCRKonq7x72TKO0TfiC1CUqH.webp"
        alt="logo"
        className={className.registrationSuccess__logoImage}
      />
    </div>
    <div className={className.registrationSuccess__title}>
      <h1>¡Registro Exitoso!</h1>
    </div>
    <div className={className.registrationSuccess__message}>
      <p>¡Felicidades! Te has registrado exitosamente. Por favor, revisa tu correo electrónico para activar tu cuenta.</p>
    </div>
  </div>
);


export default RegistrationSuccess;
