import React from 'react';
import { Link } from 'react-router-dom';
import style from './style.module.sass';
import SVGStar from '../../../../public/svg/star.svg';
import { isUser } from '../../../tools/function';

interface Props {
  unitTime: string;
  characteristics: string[];
  prices: string;
  isPopular?: boolean;
  plan: number;
  DOP: string;
}

const Card: React.FC<Props> = ({
  unitTime,
  characteristics,
  prices,
  plan,
  DOP,
  isPopular = false
}): JSX.Element => (
  <div className={`${style.card} ${isPopular ? style.card__popular : ''}`}>
    <header>
      {isPopular && (
        <div className={style.card__popularContainer}>
          <div className={style.card__popularTitle}>
            <span>Más popular</span>
            <div className={style.card__popularStar}>
              <img src={SVGStar} alt="star" />
            </div>
          </div>
        </div>
      )}
      <h2 className={style.card__title}>
        Membresía por
        <span className={style.card__uniTime}>{unitTime}.</span>
      </h2>
    </header>
    <div>
      <h4>Caracteristicas: </h4>
      <ul className={style.card__characteristics}>
        {characteristics.map((characteristic: string, index: number): JSX.Element => (
          <li
            key={index}
            className={style.card__characteristic}
          >
            <div
              className={`${style.card__check} ${isPopular ? style.card__checkmarPopular : ''}`}
            >
              <div className={style.card__checkmark}></div>
            </div>
            <span className={style.card__characteristicText}>
              {characteristic}
            </span>
          </li>
        ))}
      </ul>
    </div>
    <div className={style.card__price}>
      <span className={style.card__priceTitle}>Precio</span>
      <span className={style.card__priceValue}>${prices}</span>
      <span className={style.card__priceValueDOP}>Aproximado: {DOP}</span>
    </div>
    <div>
      <Link className={style.card__link} to={isUser() ? `/payment/${plan}` : `/register/${plan}`}>
        Comenzar ahora
      </Link>
    </div>
  </div>
);

export default Card;