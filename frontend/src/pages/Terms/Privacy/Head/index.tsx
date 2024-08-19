import React from 'react';
import CustomHead from '../../../../components/Head';

const Head = (): JSX.Element => (
  <CustomHead
    title="Política de Privacidad"
    description="La Política de Privacidad de Easy Online English detalla nuestras prácticas de procesamiento de datos, garantizando la protección y seguridad de la información personal, cumpliendo con los requisitos legales aplicables."
    schema={`
      {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "Política de Privacidad",
        "url": "https://easyonlineenglish.com/term-privacy",
        "description": "La Política de Privacidad de Easy Online English detalla nuestras prácticas de procesamiento de datos, garantizando la protección y seguridad de la información personal, cumpliendo con los requisitos legales aplicables.",
        "mainEntity": {
          "@type": "Organization",
          "name": "Easy Online English",
          "url": "https://www.easyonlineenglish.com",
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+849-410-9664",
            "email": "support@easyonlineenglish.com",
            "contactType": "customer support",
            "areaServed": "DO",
            "availableLanguage": ["es", "en"]
          },
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Cabarete",
            "addressLocality": "Puerto Plata",
            "addressCountry": "DO"
          }
        }
      }  
    `}
  />
);

export default Head;
