import React from 'react';
import style from './style.module.sass';

interface Props {
  canShow: boolean;
  className: string;
}

const LazyLoading: React.FC<Props> = ({ canShow, className }): JSX.Element => (
 <div className={`${style.lazyLoading} ${className}`}></div>
);

export default LazyLoading;
