import { Field } from '../../../components/Form/type';
import { User } from '../../../global/state/type';

type Inputs = {
  email: Field;
  password: Field;
};

type OnData = {
  data: { key: string; user: User; };
  message: string;
}

export type {
  Inputs,
  OnData
}