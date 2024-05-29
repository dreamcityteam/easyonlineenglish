import React from 'react';
import { State } from '../type';
import style from './style.module.sass';

interface Props {
  field: string;
  state: State;
  onChange: (key: string, event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleKeyPress: (event: any) => void;
}

const Input: React.FC<Props> = ({
  field,
  state,
  onChange,
  handleKeyPress
}): JSX.Element => {
  const {
    label,
    validation: {
      isNotValid,
      successMessage,
      emptyErrorMessage,
      serverErrorMessage,
      message
    } = {},
    type,
    ...props
  } = state[field];

  return (
    <>
      {label && <label>{label}</label>}
      {type !== 'textarea' && (
        <input
          onChange={(e) => onChange(field, e)}
          onKeyDown={handleKeyPress}
          type={type}
          {...props}
        />
      )}
      {type === 'textarea' && (
        <textarea
          onChange={(e) => onChange(field, e)}
          onKeyDown={handleKeyPress}
          {...props}
        />
      )}
      <div className={successMessage ? style.input__success : style.input__error}>
        {isNotValid && (
          <span>
            {
              successMessage ||
              emptyErrorMessage ||
              serverErrorMessage ||
              message
            }
          </span>
        )}
      </div>
    </>
  )
};

export default Input;