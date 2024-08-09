import React from 'react';
import MetaTag from '../../../../components/MetaTag';

const MetaTags = (): JSX.Element => (
  <MetaTag
    title="Términos y Condiciones"
    description="Lee los Términos y Condiciones de Easy Online English. Este aviso legal cubre el uso del sitio web, acceso al servicio, contenido generado por el usuario, enlaces a terceros, derechos de propiedad intelectual, y más. Acepta las políticas al acceder a nuestro sitio."
    schema={`{
      "@context": "https://schema.org",
      "@type": "TermsAndConditions",
      "name": "Términos y Condiciones Easy Online English",
      "description": "El acceso a cualquier parte de este sitio web será considerado como una aceptación integra del presente aviso legal. Incluye condiciones de uso, derechos de propiedad intelectual, acceso al servicio, contenido generado por el usuario, enlaces a terceros y más.",
      "url": "https://www.easyonlineenglish.com/term-conditions",
      "provider": {
        "@type": "Organization",
        "name": "Easy Online English",
        "url": "https://www.easyonlineenglish.com"
      },
      "termsOfService": "https://www.easyonlineenglish.com/term-conditions"
    }`}
  />
);

export default MetaTags;
