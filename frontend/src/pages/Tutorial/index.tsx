import React from 'react';
import Head from './Head';
import style from './style.module.sass';

const Contact: React.FC = () => (
  <>
    <Head />
    <section className={style.tutorial}>
      <h1>Tutorial</h1>

      <video width="520" height="440" controls>
        <source src="movie.mp4" type="https://www.w3schools.com/tags/movie.mp4" />
        <source src="movie.ogg" type="https://www.w3schools.com/tags/movie.mp4" />
        Your browser does not support the video tag.
      </video>
    </section>
  </>
);


export default Contact;
