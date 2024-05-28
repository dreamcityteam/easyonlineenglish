import React from 'react';
import Card from './Card';
import style from './style.module.sass';
import FamilyPlan from './FamilyPlan';

const Plans: React.FC = (): JSX.Element => {
  const characteristics = [
    'Habilidad de pronunciación (ilimitada)',
    'Biblioteca (incluyendo verbos)',
    'Visuales para todas las palabras + sonidos'
  ];

  const cards = [
    {
      unitTime: '1 mes',
      characteristics,
      prices: '12.99',
    },
    {
      unitTime: '1 año',
      characteristics,
      prices: '129.99',
      isPopular: true
    },
    {
      unitTime: '3 mes',
      characteristics,
      prices: '34.99'
    }
  ];

  return (
    <section className={style.plan}>
      <header>
        <h1 className={style.plan__title}>
          Planes
        </h1>
      </header>
      <div className={style.plan__cards}>
        {cards.map((props: any, index: number): JSX.Element => (
          <Card {...props} plan={index + 1} key={index} />
        ))}
      </div>
      <FamilyPlan price="149.99" />
    </section>
  );
};

export default Plans;
