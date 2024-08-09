import React from 'react';
import MetaTag from '../../../../components/MetaTag';

const MetaTags = (): JSX.Element => (
  <MetaTag
    title="Acuerdo de Licencia de Usuario Final"
    description="Acuerdo de Licencia de Usuario Final Global de Easy Online English que describe los términos y condiciones para el uso del programa, la licencia otorgada, garantías y limitaciones de responsabilidad."
    schema={`{
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Acuerdo de Licencia de Usuario Final",
      "url": "https://www.easyonlineenglish.com/term-user",
      "description": "El Acuerdo de Licencia de Usuario Final (EULA) de Easy Online English detalla los términos y condiciones para el uso del programa, la licencia otorgada, garantías, y limitaciones de responsabilidad.",
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
    }`}
  />
);

export default MetaTags;
