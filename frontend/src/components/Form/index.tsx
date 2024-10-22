import React, { useState, useMemo } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { Fields, FormField } from './type';
import style from './style.module.sass';
import { ObjectValueString } from '../../tools/type';
import { send } from '../../tools/function';
import Loading from './Loading';
import { HTTP_STATUS_CODES } from '../../tools/constant';
import { Link } from 'react-router-dom';

interface Props {
  api: string;
  avoidEmptyField?: boolean;
  bannerURL?: string;
  canClean?: boolean;
  buttonText: string;
  fields: Fields;
  google?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin'
  onData?: (data: any) => void;
  successMessage?: string;
  title?: string;
  resetPassword?: {
    label: string;
    url: string;
  };
  tokenFromHeader?: string | undefined;
};

interface State {
  [key: string]: FormField
};

const Form: React.FC<Props> = ({
  api,
  bannerURL,
  buttonText,
  canClean = true,
  fields,
  google,
  onData = () => { },
  resetPassword,
  successMessage,
  title,
  tokenFromHeader,
}): JSX.Element => {
  const [state, setState] = useState<State>(fields);
  const fieldKeys: string[] = useMemo(() => Object.keys(state), []);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const onClick = async (event: any): Promise<void> => {
    event && event.preventDefault();

    if (isValid()) {
      handleApiResponse({ data: getData(), api });
    }
  }

  const handleApiResponse = async ({ data, api }: { data: any, api: string; }) => {
    setIsLoading(true);

    const { response: { data: dataResponse, statusCode } } = await send({ api, data, token: tokenFromHeader }).post();
    const isBadRequest: boolean = statusCode === HTTP_STATUS_CODES.BAD_REQUEST;
    const isSuccessfully: boolean = statusCode === HTTP_STATUS_CODES.OK;

    setIsSuccess(isSuccessfully);

    if (isSuccessfully) {      
      onData(dataResponse);
      canClean && cleanAllInput();
    }

    if (isBadRequest && dataResponse) {
      Object.keys(dataResponse).forEach((key: string): void => {
        const field: FormField = state[key];

        if (field) {
          field.errorMessage = dataResponse[key] || '';
          setField(key, field);
        }
      });
    }

    setIsLoading(false);
  }

  const getData = (): ObjectValueString => {
    const data: ObjectValueString = {};

    Object.keys(state).forEach((key: string) => {
      data[key] = state[key].value || '';
    });

    return data;
  }

  const onKeyDown = ({ key }: any): void => {
    key === 'Enter' && onClick(null);
  }

  const onChange = ({ target: { value = '', name: key } }: any): void =>
    setField(key, { ...state[key], value });

  const isValid = (): boolean => {
    let isValid: boolean = true;

    fieldKeys.forEach((fieldKey: string): void => {
      const field: FormField = state[fieldKey];
      const value: string = field.value || '';
      const isEmpty: boolean = !value;
      const isErrorMessage: boolean = !!field.validator && !field.validator.regExp.test(value);
      const avoidEmptyField = isErrorMessage && !field.avoidEmptyField || value && isErrorMessage;
      const isRepeatPassword: boolean = (
        fieldKey === 'repeatPassword' &&
        !!field.value && 
        !!state['password']
      );

      if (isRepeatPassword) {
        const fieldPassword: FormField = state['password'];
        const isNotValid: boolean = fieldPassword.value !== field.value;

        field.errorMessage = isNotValid ? 'Las contraseñas ingresadas no coinciden.' : '';
        isValid = false;
      } else if (isEmpty && !field.avoidEmptyField) {
        field.errorMessage = 'Por favor, completa este campo obligatorio.';
      } else if (avoidEmptyField) {
        field.errorMessage = field.validator?.message;
      } else {
        field.errorMessage = '';
      }

      if (isValid) {
        isValid = !(isEmpty || isErrorMessage);

        if (!avoidEmptyField) {
          isValid = true;
        }
      }

      setField(fieldKey, field);
    });

    return isValid;
  }

  const setField = (key: string, value: FormField): void =>
    setState((currentState: State): State => ({ ...currentState, [key]: value }));

  const cleanAllInput = (): void =>
    fieldKeys.forEach((key: string) => {
      const field = state[key];

      field.value = '';

      setField(key, field);
    });

  return (
    <div className={style.form}>
      {bannerURL && (
        <div className={style.form__banner}>
          <img src={bannerURL} alt="banner" />
        </div>
      )}

      <form className={style.form__container}>
        {title && (
          <header className={style.form__header}>
            <h1>{title}</h1>
          </header>
        )}

        {fieldKeys.map((key: string, index: number) => {
          const {
            placeholder, value = '', type,
            label, errorMessage = '', options = [],
            autocomplete = ''
          } = state[key];

          return (
            <div key={index} className={style.form__input}>
              {label && <label className={style.form__label}>{label}</label>}
              {type === 'textarea' && (
                <textarea
                  name={key}
                  onChange={onChange}
                  onKeyDown={onKeyDown}
                  placeholder={placeholder}
                  value={value}
                  autoComplete={autocomplete}
                />
              )}

              {!['select', 'textarea'].includes(type) && (
                <input
                  name={key}
                  onChange={onChange}
                  onKeyDown={onKeyDown}
                  placeholder={placeholder}
                  type={type}
                  value={value}
                  autoComplete={autocomplete}
                />
              )}

              {!!(type === 'select' && options.length) && (
                <select
                  name={key}
                  onChange={onChange}
                  onKeyDown={onKeyDown}
                  value={value}
                >
                  <option value="" disabled>
                    {placeholder}
                  </option>
                  {options.map((option: string, index: number) =>
                    <option key={index} value={option} className={style.form__option}>
                      {option}
                    </option>
                  )}
                </select>
              )}

              {errorMessage && <span className={style.form__error}>{errorMessage}</span>}
              {
                isSuccess && 
                successMessage &&
                !errorMessage &&
                (index === fieldKeys.length - 1) && (
                  <span className={style.form__success}>
                    {successMessage}
                  </span>
                )
              }
            </div>
          )
        })}

        {isLoading ? (
          <Loading />
        ) : (
          <input
            onClick={onClick}
            type="submit"
            value={buttonText}
            className={style.form__submit}
          />
        )}

        <GoogleOAuthProvider clientId={process.env.GOOGLE_ID_CLIENT || ''}>
          {google &&
            <GoogleLogin
              onSuccess={async (credentialResponse) => {
                const token: string = credentialResponse.credential || '';

                handleApiResponse({ api: `${api}-google`, data: { token } });
              }}

              onError={() => {
                console.log('Login Failed');
              }}
              text={google}
              width="200"
            />
          }
        </GoogleOAuthProvider>
        {resetPassword && (
          <Link
            className={style.form__link}
            to={resetPassword.url}
          >
            {resetPassword.label}
          </Link>
        )}
      </form>
    </div>
  );
}

export default Form;
