import React from 'react';

interface LoadingProps {
  path: string;
  alt: string;
  className?: string;
  onClick?: () => void;
}

const Image: React.FC<LoadingProps & React.RefAttributes<HTMLImageElement>> = React.forwardRef<HTMLImageElement, LoadingProps>(
  ({ path, alt, className = '', onClick = () => {} }, ref): JSX.Element => (
    <img
      alt={alt}
      className={className}
      ref={ref}
      src={`https://abaw33hy9bfvxqdq.public.blob.vercel-storage.com/${path}`}
      onClick={onClick}
    />
  )
);

export default Image;
