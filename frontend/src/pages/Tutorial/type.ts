import { Field } from '../../components/Form/type';

type Inputs = {
  name: Field;
  email: Field;
  subject: Field;
  message: Field;
};

type Info = {
  path: string;
  alt: string;
  description: string;
  title: string;
};

export type {
  Inputs,
  Info
};
