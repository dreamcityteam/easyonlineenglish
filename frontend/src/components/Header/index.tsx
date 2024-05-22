import React from 'react';

interface Props {
  title: string;
  subTitle?: string;
};

const Header: React.FC<Props> = ({ title, subTitle }): JSX.Element => (
  <header>
    <h1>{title}</h1>
    {subTitle && <h2>{subTitle}</h2>}
  </header>
);

export default Header;
