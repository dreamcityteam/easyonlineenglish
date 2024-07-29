import React from 'react';
import Image from '../../../../components/Image';
import style from './style.module.sass';
import { Card as CardType } from '../type';

const Card = ({ alt, path, userName, userTag, description }: CardType): JSX.Element => (
  <div className={style.card}>
    <div>
      <Image alt={alt} path={path} className={style.card__photo} />
      <div className={style.card__content}>
        <h3 className={style.card__userName}>{userName}</h3>
        <span className={style.card__tag}>{userTag}</span>
      </div>
    </div>
    <p  className={style.card__description}>
      {description}
    </p>
  </div>
);

export default Card;
