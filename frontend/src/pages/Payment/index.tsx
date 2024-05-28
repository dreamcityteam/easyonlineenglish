import React from 'react';
import { useParams } from 'react-router-dom';

const Payment: React.FC = (): JSX.Element => {
  const { paymentMethod } = useParams<string>();

  return (
    <section>
      <h1>{paymentMethod}</h1>
    </section>
  );
};

export default Payment;
