import React from 'react';
import MetaTag from '../../../../components/MetaTag';

const MetaTags = (): JSX.Element => (
  <MetaTag
    title="Términos y Condiciones de Compra del Producto"
    description="Términos y condiciones aplicables a la compra de cursos y productos en línea de Easy Online English, incluyendo planes de membresía, renovación, política de devoluciones, y formas de pago."
    schema={`{
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Términos y Condiciones de Compra del Producto",
      "url": "https://www.easyonlineenglish.com/term-payment",
      "description": "Los términos y condiciones aplicables a la compra de cursos y productos en línea de Easy Online English, incluyendo planes de membresía, renovación automática, política de devoluciones, y formas de pago.",
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
