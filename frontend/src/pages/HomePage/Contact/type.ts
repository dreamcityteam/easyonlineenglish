import { Field } from "../../../components/Form/type";

type Inputs = {
  name: Field;
  email: Field;
  subject: Field;
  message: Field;
};

type Info = {
  googleId: string;
  title: string;
  info: string;
}

export type {
  Inputs,
  Info
}