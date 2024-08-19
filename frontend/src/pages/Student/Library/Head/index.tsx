import React from 'react';
import CustomHead from '../../../../components/Head';
interface Props {
  title: string;
  description: string;
}

const Head: React.FC<Props> = ({ title, description }): JSX.Element => (
  <CustomHead
    title={title}
    description={description}
  />
);

export default Head;
