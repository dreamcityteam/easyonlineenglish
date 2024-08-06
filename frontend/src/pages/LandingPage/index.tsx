import React from 'react';
import Section1 from './Section1';
import Section2 from './Section2';
import Section3 from './Section3';
import Section4 from './Section4';
import Section6 from './Section6';
import Section5 from './Section5';
import style from './style.module.sass';
import MetaTags from './MetaTags';

const Home: React.FC = () => (
  <>
    <MetaTags />
    <section className={style.home}>
      <Section1 />
      <Section2 />
      <Section3 />
      <Section4 />
      <Section5 />
      <Section6 />
    </section>
  </>
);

export default Home;
