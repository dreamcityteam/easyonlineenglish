import React from 'react';
import CustomHead from '../../../../components/Head';

const Head = (): JSX.Element => (
  <CustomHead
    title="Cursos"
    description="Mejora tu pronunciación y habilidades de conversación en inglés con este curso integral. Aprende a comunicarte con confianza en situaciones cotidianas y profesionales."
    schema={`
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Cursos de Easy Online English",
      "url": "https://www.easyonlineenglish.com/cursos",
      "mainEntity": {
        "@type": "ItemList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "item": {
              "@type": "Course",
              "name": "Inglés Conversacional",
              "description": "Mejora tu pronunciación y audio en este curso de inglés.",
              "provider": {
                "@type": "Organization",
                "name": "Easy Online English",
                "url": "https://www.easyonlineenglish.com"
              },
              "image": "https://abaw33hy9bfvxqdq.public.blob.vercel-storage.com/courses/conversational-english/Conversational-English-9IEp6hzB0xYStoL857RYReAnNopuj8.avif",
              "url": "https://www.easyonlineenglish.com/course/66427179a12ee1e3088c4917",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD",
                "url": "https://www.easyonlineenglish.com/course/66427179a12ee1e3088c4917",
                "availability": "https://schema.org/InStock"
              }
            }
          },
          {
            "@type": "ListItem",
            "position": 2,
            "item": {
              "@type": "Course",
              "name": "Curso de Hotelería",
              "description": "Mejora tu pronunciación y audio en este curso de inglés para hoteles.",
              "provider": {
                "@type": "Organization",
                "name": "Easy Online English",
                "url": "https://www.easyonlineenglish.com"
              },
              "image": "https://abaw33hy9bfvxqdq.public.blob.vercel-storage.com/courses/recurso_1-100_720-HMq49kOtnoLKrMIc2e69FT6A2iAadI.jpg",
              "url": "https://www.easyonlineenglish.com/courses",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD",
                "url": "https://www.easyonlineenglish.com/courses",
                "availability": "https://schema.org/PreOrder"
              }
            }
          }
        ]
      }
    }
  `}
  />
);

export default Head;
