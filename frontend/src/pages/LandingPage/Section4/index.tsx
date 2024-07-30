import React from 'react';
import style from './style.module.sass';
import { Card as CardType } from './type';
import Card from './Card';
import { cards } from './data';

const Section4: React.FC = (): JSX.Element => (
  <article className={style.home}>
    <div className={style.home__wrapper}>
      <header className={style.home__header}>
        <h2>Testimonios</h2>
      </header>

      <div className={style.home__cards}>
        {cards.map((props: CardType, index: number): JSX.Element =>
          <Card
            {...props}
            key={index}
          />
        )}
      </div>
    </div>
  </article>
);

export default Section4;
