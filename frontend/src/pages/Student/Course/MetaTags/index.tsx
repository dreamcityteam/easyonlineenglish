import React from 'react';
import MetaTag from '../../../../components/MetaTag';

interface Props {
  title: string;
  description: string;
}

const MetaTags: React.FC<Props> = ({ title, description }): JSX.Element => (
  <MetaTag
    title={title}
    description={description}
    schema={`
      {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "${title}.",
        "description": "${description}.",
        "mainEntity": {
          "@type": "EducationalCourse",
          "name": "${title}.",
          "description": "${description}.",
          "courseMode": "Online",
          "offers": {
            "@type": "$12.99",
            "priceCurrency": "USD",
            "price": "Free",
            "itemOffered": {
              "@type": "EducationalMaterial",
              "name": "${title}.",
              "description": "Material de la lección uno que incluye prácticas de pronunciación y vocabulario."
            }
          }
        }
      }  
    `}
  />
);

export default MetaTags;
