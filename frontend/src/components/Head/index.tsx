import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

interface Props {
  title: string;
  description: string;
  schema?: string;
}

const Head = ({
  title,
  description,
  schema
}: Props): JSX.Element => {
  const path = useLocation();
  const origin: string = window.origin;
  const fullPath: string = origin + path.pathname;

  return (
    <Helmet>
      <title>{title} - Easy Online English</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={fullPath} />

      <meta property="og:title" content={`${title} - Easy Online English`} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={fullPath} />
      <meta property="og:image"content={`${origin}/logo192.png`} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={`${title} - Easy Online English`} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${origin}/logo192.png`} />

      {schema && (
        <script type="application/ld+json">
        {schema}
      </script>
      )}      
    </Helmet>
  );
};

export default Head;
