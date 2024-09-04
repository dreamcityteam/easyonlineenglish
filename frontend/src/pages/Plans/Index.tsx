import React from 'react';
import Card from './Card';
import style from './style.module.sass';
import FamilyPlan from './FamilyPlan';
import Head from './Head';

const Plans: React.FC = (): JSX.Element => {
  const characteristics: string[] = [
    'Proceso de aprendizaje simplificado que cualquiera puede realizar.',
    'Pronunciación.',
    'Biblioteca para encontrar palabras comunes, todos los verbos conjugados, números, días y meses.'
  ];

  const cards = [
    {
      unitTime: '1 mes',
      characteristics,
      prices: '12.99',
      DOP: 'DOP $775.98',
    },
    {
      unitTime: '1 año',
      characteristics,
      prices: '129.99',
      isPopular: true,
      DOP: 'DOP $7,765.14',
    },
    {
      unitTime: '3 mes',
      characteristics,
      prices: '34.99',
      DOP: 'DOP $2,090.18',
    }
  ];

  return (
    <>
    <Head />
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
    </>
  );
};

export default Plans;
