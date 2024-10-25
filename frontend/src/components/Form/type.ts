type Field = {
  avoidEmptyField?: boolean;
  label?: string;
  placeholder: string;
  type: 'text' | 'password' | 'email' | 'textarea' | 'select' | 'tel';
  value?: string;
  validator?: {
    message: string;
    regExp: RegExp;
    serverMessage?: string;
  }
  options?: string[];
  autocomplete?: 'new-password' | 'off' | 'on'
};

type Fields = {
  [key: string]: Field;
};

type FormField = Field & { errorMessage?: string; };

type HandleApiResponse = {
  data: any;
  api: string;
  isGoogle?: boolean;
};

export type {
  Field,
  Fields,
  FormField,
  HandleApiResponse
}
