import React from 'react';
import style from './style.module.sass';
import { Link } from 'react-router-dom';
import { ASSETS_URL } from '../../../tools/constant';

interface Props {
  price: string;
}

const FamilyPlan: React.FC<Props> = ({ price }): JSX.Element => (
  <div className={style.familyPlan}>
    <div className={style.familyPlan__container}>
      <div>
        <span className={style.familyPlan__title}>Plan fimiliar</span>
      </div>
      <div className={style.familyPlan__user}>
        <img
          className={style.familyPlan__img}
          src={`${ASSETS_URL}2016/12/user5.png`}
        />
        <ul className={style.familyPlan__list}>
          <li>Hasta 5 usuarios</li>
          <li>en una sola</li>
          <li>cuenta.</li>
        </ul>
      </div>
      <div>
        <div className={style.familyPlan__price}>
          <span>Price </span>
          <span> ${price}</span>
        </div>
      
        <Link className={style.familyPlan__link} to="/payment/4">
          Comenzar ahora
        </Link>
      </div>
    </div>
  </div>
);

export default FamilyPlan;
