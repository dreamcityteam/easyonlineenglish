import React from 'react';
import CustomHead from '../../../../components/Head';

const Head = (): JSX.Element => (
  <CustomHead
    title="Login"
    description="Inicia sesión en Easy Online English para acceder a tu cuenta y comenzar a mejorar tu inglés"
    schema={`
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Login Page",
      "description": "Inicia sesión en Easy Online English para acceder a tu cuenta y comenzar a mejorar tu inglés",
      "mainEntity": {
        "@type": "WebPage",
        "name": "Login Page",
        "description": "Inicia sesión en Easy Online English para acceder a tu cuenta y comenzar a mejorar tu inglés.",
        "potentialAction": {
          "@type": "Action",
          "name": "Login",
          "target": "/login",
          "actionStatus": "PotentialActionStatus",
          "instrument": {
            "@type": "WebApplication",
            "name": "Web Application"
          }
        }
      }
    } 
  `}
  />
);

export default Head;
