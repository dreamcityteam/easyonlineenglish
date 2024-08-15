import React from 'react';
import MetaTag from '../../../../components/MetaTag';

interface Props {
  title: string;
  description: string;
}

const MetaTags: React.FC<Props> = ({ title, description }): JSX.Element => (
  <MetaTag
    title={title}
    description={description}
  />
);

export default MetaTags;
