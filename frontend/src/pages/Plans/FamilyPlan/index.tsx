import React from 'react';
import style from './style.module.sass';
import { Link } from 'react-router-dom';
import Image from '../../../components/Image';

interface Props {
  price: string;
}

const FamilyPlan: React.FC<Props> = ({ price }): JSX.Element => (
  <div className={style.familyPlan}>
    <div className={style.familyPlan__container}>
      <div className={style.familyPlan__titleContainer}>
        <span className={style.familyPlan__title}>Plan Familiar</span>
        <span>6 meses</span>
      </div>
      <div className={style.familyPlan__user}>
        <Image
          className={style.familyPlan__img}
          path="icons/users-7Y4DMJFPNpmW4QLSn9S2v3V9aN60SS.png"
          alt="Icon users"
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
        <Link className={style.familyPlan__link} to="#">
          Muy pronto
        </Link>
      </div>
    </div>
  </div>
);

export default FamilyPlan;
