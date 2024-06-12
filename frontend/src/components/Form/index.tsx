import React, { useState, useCallback, useMemo } from 'react';
import { getInitialState } from './helper';
import { Inputs, State, FieldForm } from './type';
import { send } from '../../tools/function';
import Loading from './Loading';
import { Response } from '../../tools/type';
import Input from './Input';
import { HTTP_STATUS_CODES } from '../../tools/constant';
import style from './style.module.sass';

interface Props {
  api: string;
  buttonText?: string;
  inputs: Inputs;
  onData: (data: any, updateState: (key: string, field: any) => void) => void;
  token?: string;
  canCleanInput?: boolean;
  custom?: (props: any) => JSX.Element;
  title?: string;
  errorMessage?: string;
};

const Form: React.FC<Props> = ({
  inputs,
  api,
  buttonText = 'Enviar',
  token,
  onData,
  canCleanInput = false,
  custom,
  title,
  errorMessage
}): JSX.Element => {
  const keys: string[] = useMemo(() => Object.keys(inputs), []);
  const [state, setState] = useState<State>(useMemo(() => getInitialState(keys, inputs), []));
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const canSend = useCallback((): boolean => {
    let isValid: boolean = true;

    keys.forEach((key: string): void => {
      const field: FieldForm = state[key];

      if (field.validation?.isOpcional === true && !field.value) {
        field.validation = { ...field.validation, emptyErrorMessage: '', isNotValid: false };
      } else if (!field.value) {
        const emptyErrorMessage = field.validation?.emptyErrorMessage || 'Por favor, complete este campo.';
        field.validation = { ...field.validation, emptyErrorMessage, isNotValid: true };
        isValid = false;
      } else if (field.validation) {
        const isNotValid = !!(field.validation.regExp && !field.validation.regExp.test(field.value));
        field.validation = { ...field.validation, isNotValid, emptyErrorMessage: '' };
        if (isNotValid) isValid = false;
      }

      updateState(key, field);
    });

    return isValid;
  }, [state]);

  const onSend = useCallback(async (): Promise<void> => {
    if (canSend()) {
      setIsLoading(true);
      const data: Response = await send({ api, data: getPayload(), token }).post();

      onData(data, updateState);
      data.response.statusCode === HTTP_STATUS_CODES.OK && canCleanInput && cleanInput();
      setIsLoading(false);
    }
  }, [canSend]);

  const cleanInput = (): void => {
    setState((currentState) => {
      const newState: any = {};

      keys.forEach((key: string) => {
        newState[key] = { ...currentState[key], value: '' }
      });

      return newState;
    });
  }

  const getPayload = (): Inputs =>
    keys.reduce((prevState: any, key: string) =>
      ({ ...prevState, [key]: state[key].value }), {});

  const onChange = useCallback((key: string, event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { value } = event.target;
    const field: FieldForm = { ...state[key], value };

    updateState(key, field);
  }, []);

  const updateState = (key: string, field: FieldForm): void => {
    setState((prevState: State) => ({
      ...prevState,
      [key]: {
        ...prevState[key],
        ...field
      }
    }));
  }

  const handleKeyPress = (event: any): void => {
    if (event.key === 'Enter') {
      onSend();
    }

    if ((event.key === 'e' || event.key === 'E' || event.key === '.') && event.target.type === 'number') {
      event.preventDefault();
    }
  };

  return (
    <div className={style.form}>
      {title && (
        <header className={style.form__title}>
          <h1>{title}</h1>
          <span className={style.form__errorMessage}>{errorMessage}</span>
        </header>
      )}
      {custom ? custom({ state, onChange, handleKeyPress, onSend, isLoading }) : (
        <form >
          {Object.keys(state).map((field: string, index: number) => (
            <div key={index} className={style.form__container}>
              <Input
                field={field}
                state={state}
                onChange={onChange}
                handleKeyPress={handleKeyPress}
              />
            </div>
          ))}
          <div className={style.button__container}>
            {isLoading ? <Loading /> : (
              <input
                className={style.button}
                onClick={onSend}
                type="button"
                value={buttonText}
              />
            )}
          </div>
        </form>
      )}
    </div>
  );
};

export default Form;
