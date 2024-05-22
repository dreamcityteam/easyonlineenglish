import React, { useState, useCallback, useMemo } from 'react';
import { getInitialState } from './helper';
import { Inputs, State, FieldForm } from './type';
import style from './style.module.sass';
import { send } from '../../tools/function';
import Loading from './Loading';
import { Response } from '../../tools/type';

interface Props {
  api: string;
  buttonText?: string;
  inputs: Inputs;
  onData: (data: any, updateState: (key: string, field: any) => void) => void;
  token?: string;
};

const Form: React.FC<Props> = ({ inputs, api, buttonText = 'Enviar', token, onData }): JSX.Element => {
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
      setIsLoading(false);
    }
  }, [canSend]);

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
    <form className={style.form}>
      {Object.values(state).map(({ validation, label, type = 'text', ...inputAttr }: FieldForm, index: number) => (
        <div key={index} className={style.input__container}>
          {label && <label className={style.label}>{label}</label>}
          {type === 'textarea' && (
            <textarea
              className={style.field}
              onChange={(e) => onChange(keys[index], e)}
              {...inputAttr}
              onKeyDown={handleKeyPress}
            />)}
          {type !== 'textarea' && (
            <input
              className={style.field}
              onChange={(e)  => onChange(keys[index], e)}
              type={type}
              {...inputAttr}
              onKeyDown={handleKeyPress}
            />)}
          <div className={style.message__container}>
            {validation?.isNotValid && (
              <span className={validation.successMessage ? style.success__message : style.error__message}>
                {
                  validation.successMessage ||
                  validation.emptyErrorMessage ||
                  validation.serverErrorMessage ||
                  validation.message
                }
              </span>
            )}
          </div>
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
  );
};

export default Form;
