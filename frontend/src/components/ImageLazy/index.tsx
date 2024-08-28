import React, { useEffect, useState } from 'react';
import style from './style.module.sass';

interface Props {
  alt: string | undefined;
  className?: string;
  onClick?: (event: any) => void;
  onLoad?: (event: any) => void;
  src: string | undefined;
}

const ImageLazy: React.FC<Props & React.RefAttributes<HTMLImageElement>> = React.forwardRef<HTMLImageElement, Props>(
  ({
    src = '',
    alt = '',
    className = '',
    onClick = () => { },
    onLoad = () => { }
  },
    ref
  ): JSX.Element => {
    const [isInView, setIsInView] = useState<boolean>(true);

    useEffect(() => {
      setIsInView(false);
    }, [src]);

    const handlerOnLoad = (event: any) => {
      setIsInView(true);
      onLoad(event);
    };

    return (
      <>
        <img
          alt={alt}
          className={className}
          loading="lazy"
          onClick={onClick}
          onLoad={handlerOnLoad}
          ref={ref}
          src={src}
          style={{
            opacity: isInView ? 1 : 0,
            transition: 'opacity 0.3s ease-in-out'
          }}
        />
        <div
          style={{
            display: isInView ? 'none' : 'block',
            position: 'absolute'
          }}
          className={style.imageLazy__loader}
        />
      </>
    );
  }
);

export default ImageLazy;
