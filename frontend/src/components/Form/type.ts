type Validation = {
  message?: string;
  regExp?: RegExp;
  emptyErrorMessage?: string;
  isOpcional?: boolean;
};

type Field = {
  label?: string;
  placeholder?: string;
  type?: 'text' | 'password' | 'email' | 'textarea' | 'tel' | 'hidden' | 'number';
  value?: string;
  autoComplete?: 'off' | 'on' | 'new-password';
  validation?: Validation;
};

type FieldForm = Field & {
  validation: Validation & {
    serverErrorMessage: string;
    successMessage?:  string;
    isNotValid: boolean;
  };
};

type Inputs = {
  [key: string]: Field;
};

type State = {
  [key: string]: FieldForm;
};

export type {
  Field,
  Inputs,
  Validation,
  State,
  FieldForm
};
