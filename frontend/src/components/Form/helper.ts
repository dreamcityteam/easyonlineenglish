import { Inputs, State } from './type';

const getInitialState = (keys: string[], inputs: Inputs): State =>
  keys.reduce((prevState, key: string): State => ({
    ...prevState,
    [key]: {
      ...inputs[key],
      value: inputs[key].value || '',
      ...(inputs[key].validation ? {
        validation: {
          ...inputs[key].validation,
          serverErrorMessage: '',
          isNotValid: false,
        }
      } : {}),
    }
  }), {});

export {
  getInitialState
}
