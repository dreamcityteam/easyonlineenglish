import React from 'react';
import CustomHead from '../../../components/Head';

const Head = (): JSX.Element => (
  <CustomHead
    title="Contacto"
    description="Ponte en contacto con Easy Online English. Contáctanos para cualquier consulta, soporte o comentario."
    schema={`
    {
      "@context": "https://schema.org",
      "@type": "ContactPage",
      "name": "Contacto",
      "url": "https://easyonlineenglish.com/contact",
      "description": "Ponte en contacto con Easy Online English. Contáctanos para cualquier consulta, soporte o comentario.",
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+1 (849) 505-8393",
        "email": "support@easyonlineenglish.com",
        "contactType": "Servicio al Cliente",
        "areaServed": "Mundo",
        "availableLanguage": ["Inglés", "Español"],
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Cabarete",
          "addressRegion": "Puerto Plata",
          "addressCountry": "República Dominicana"
        }
      }
    }
  `}
  />
);

export default Head;
