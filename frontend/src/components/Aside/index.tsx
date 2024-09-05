import React, { useContext, useEffect, useState } from 'react';
import style from './style.module.sass';

interface Props {
  onClick: (even: any) => void,
  data: {
    name: string;
    content: Array<any>
  }[];
  tabIndex: number;
}

const Aside: React.FC<Props> = ({ onClick, data, tabIndex }): JSX.Element => (
  <aside className={style.aside}>
    <ul className={style.aside__tabs}>
      {data.map(({ name }: any, index: number): JSX.Element => (
        <li
          key={index}
          onClick={() => onClick(index)}
          className={`${style.aside__tab} ${tabIndex === index ? style.aside__focus : ''}`}
        >
          <span className={style.aside__section}>
            {name}
          </span>
        </li>
      ))}
    </ul>
  </aside>
);

export default Aside;
