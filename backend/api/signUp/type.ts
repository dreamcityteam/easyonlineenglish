import { Validator } from '../../tools/type';

type Field = {
  key: string;
  value: string;
  validator: Validator;
};

export type {
  Field
};
