import React from 'react';
import MetaTag from '../../../components/MetaTag';

const MetaTags = (): JSX.Element => (
  <MetaTag
    title="Planes"
    description="Elige entre planes de 1 mes, 3 meses o 1 año en Easy Online English. Accede a recursos educativos, pronunciación y una biblioteca completa para mejorar tu inglés."
    schema={`
      {
        "@context": "https://schema.org",
        "@type": "OfferCatalog",
        "name": "Planes",
        "hasOffer": [
          {
            "@type": "Offer",
            "name": "Membresía por 1 mes",
            "price": "12.99",
            "priceCurrency": "USD",
            "itemOffered": {
              "@type": "Product",
              "name": "Membresía por 1 mes",
              "description": "Proceso de aprendizaje simplificado que cualquiera puede realizar. Incluye pronunciación y una biblioteca para encontrar palabras comunes, verbos conjugados, números, días y meses."
            }
          },
          {
            "@type": "Offer",
            "name": "Membresía por 3 meses",
            "price": "34.99",
            "priceCurrency": "USD",
            "itemOffered": {
              "@type": "Product",
              "name": "Membresía por 3 meses",
              "description": "Proceso de aprendizaje simplificado que cualquiera puede realizar. Incluye pronunciación y una biblioteca para encontrar palabras comunes, verbos conjugados, números, días y meses."
            }
          },
          {
            "@type": "Offer",
            "name": "Membresía por 1 año",
            "price": "129.99",
            "priceCurrency": "USD",
            "itemOffered": {
              "@type": "Product",
              "name": "Membresía por 1 año",
              "description": "Proceso de aprendizaje simplificado que cualquiera puede realizar. Incluye pronunciación y una biblioteca para encontrar palabras comunes, verbos conjugados, números, días y meses."
            }
          },
          {
            "@type": "Offer",
            "name": "Plan Familiar",
            "price": "149.99",
            "priceCurrency": "USD",
            "itemOffered": {
              "@type": "Product",
              "name": "Plan Familiar",
              "description": "Plan para hasta 5 usuarios en una sola cuenta durante 6 meses."
            }
          }
        ]
      }
  `}
  />
);

export default MetaTags;
