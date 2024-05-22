import React from 'react';

interface Props {
  id: string;
  alt: string;
  className?: string;
};

const GoogleDriveImage: React.FC<Props> = ({ id, alt, className }): JSX.Element => (
  <img src={`https://lh3.googleusercontent.com/d/${id}`} alt={alt} className={className} />
);

export default GoogleDriveImage;
