import React, { useEffect } from 'react';

interface Animation {
  ref: React.MutableRefObject<any> | React.MutableRefObject<any>[];
  windowHeight?: number;
  classNameAnimation: string;
};

const useScrollAnimation = ({
  ref,
  windowHeight = 300,
  classNameAnimation
}: Animation): void => {
  useEffect(() => {
    const handleScroll = () => {
      const execute = (refElement: React.MutableRefObject<any>) => {
        if (refElement.current) {
          const element = refElement.current;
          const rect = element.getBoundingClientRect();
          const actualWindowHeight = window.innerHeight || document.documentElement.clientHeight;

          if (rect.top <= (actualWindowHeight - windowHeight) && rect.bottom >= 0) {
            element.classList.add(classNameAnimation);
          }
        }
      };

      if (Array.isArray(ref)) {
        ref.forEach((refElement: React.MutableRefObject<any>) => execute(refElement));
      } else {
        execute(ref);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
};

export default useScrollAnimation;
