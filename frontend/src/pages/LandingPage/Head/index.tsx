import React from 'react';
import CustomHead from '../../../components/Head';

const Head = (): JSX.Element => (
  <CustomHead
    title="Aprende Inglés como Segunda Lengua"
    description="Aprende Inglés como segunda lengua con Easy Online English. Aprende a tu ritmo donde quieras, cuando quieras."
    schema={`
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Easy Online English",
      "url": "https://easyonlineenglish.com/",
      "description": "Aprende inglés con Easy Online English. Ofrecemos un método fácil y accesible para mejorar tu inglés con recursos audiovisuales, ejercicios de pronunciación y una comunidad activa de estudiantes.",
      "publisher": {
        "@type": "Organization",
        "name": "Easy Online English",
        "url": "https://easyonlineenglish.com/",
        "logo": {
          "@type": "ImageObject",
          "url": "https://abaw33hy9bfvxqdq.public.blob.vercel-storage.com/icons/logo-hUzihbdc6SVraJNSw22mWbQWhY8aF7.avif"
        },
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+1 (849) 410-9664",
          "email": "support@easyonlineenglish.com",
          "contactType": "Customer Service",
          "areaServed": "World",
          "availableLanguage": ["English", "Spanish"],
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Cabarete",
            "addressRegion": "Puerto Plata",
            "addressCountry": "Dominican Republic"
          }
        }
      },
      "mainEntity": {
        "@type": "EducationalOrganization",
        "name": "Easy Online English",
        "url": "https://easyonlineenglish.com/",
        "logo": {
          "@type": "ImageObject",
          "url": "https://abaw33hy9bfvxqdq.public.blob.vercel-storage.com/icons/logo-hUzihbdc6SVraJNSw22mWbQWhY8aF7.avif"
        },
        "sameAs": ["https://discord.com/invite/QFaTXbkd"],
        "description": "Aprende inglés con nuestro enfoque fácil y simple que combina teoría y práctica usando métodos modernos. Mejora tu inglés con recursos audiovisuales y ejercicios de pronunciación.",
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+1 (849) 410-9664",
          "email": "support@easyonlineenglish.com",
          "contactType": "Customer Service",
          "areaServed": "World",
          "availableLanguage": ["English", "Spanish"],
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Cabarete",
            "addressRegion": "Puerto Plata",
            "addressCountry": "Dominican Republic"
          }
        }
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": "https://easyonlineenglish.com/"
      }
    }
  `}
  />
);

export default Head;
