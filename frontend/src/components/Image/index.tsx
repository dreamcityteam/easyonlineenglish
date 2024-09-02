import React from 'react';

interface Props {
  alt: string;
  className?: string;
  onClick?: () => void;
  path: string;
  style?: { [key: string]: string | number; }
}

const Image: React.FC<Props & React.RefAttributes<HTMLImageElement>> = React.forwardRef<HTMLImageElement, Props>(
  ({ path, alt, style, className = '', onClick = () => {} }, ref): JSX.Element => (
    <img
      style={style}
      alt={alt}
      {...className ? { className: className } : {} }
      {...ref ? { ref: ref } : {} }
      src={`https://abaw33hy9bfvxqdq.public.blob.vercel-storage.com/${path}`}
      onClick={onClick}
    />
  )
);

export default Image;
