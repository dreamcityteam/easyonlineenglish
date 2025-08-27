import React, { useContext } from 'react';
import { CLEAR_LOAD, SET_LOAD } from '../global/state/actionTypes';
import { HTTP_STATUS_CODES, ROLE } from './constant';
import { Request, RequestOptions, Send, Response, Data } from './type';
import context from '../global/state/context';
import { User } from '../global/state/type';

/**
 * Uploads a file blob to the Vercel Blob Storage service.
 * @param {Object} params - The parameters for uploading the blob.
 * @param {string} params.service - The service to which the file will be uploaded.
 * @param {any} params.file - The file to be uploaded.
 * @returns {Promise<string>} The URL of the uploaded file or an empty string if the upload fails.
 */
const uploadBlob = async ({ service, file }: { service: string; file: any; }): Promise<string> => {
  if (!file) return '';

  try {
    const formData: FormData = new FormData();
    const [fileName] = file.name.split('.');

    formData.append('photo', file);

    const { response: { data, statusCode } } = await fetch(
      `${getDomainBasedOnEnvironment()}/api/v1/${service}?filename=${fileName}.jpg`,
      {
        method: 'POST',
        body: formData,
        credentials: getFetchCredentialsBasedOnEnvironment(),
      }
    ).then(response => response.json());

    return statusCode === HTTP_STATUS_CODES.OK ? data : '';
  } catch (error) {
    console.error('Error uploading file:', error);
    return ''
  }
}

/**
 * Sends an HTTP request to the specified API.
 * @param {Request} params - The parameters for the request.
 * @returns {Send} An object containing methods for different HTTP methods (GET, POST, DELETE, PUT, PATCH).
 */
const send = ({ api, data, token }: Request): Send => {
  const options: RequestOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    credentials: getFetchCredentialsBasedOnEnvironment(),
    method: 'GET',
    ...(data ? { body: JSON.stringify(data) } : {}),
  };

  const request = async (options: RequestOptions): Promise<Response> => {
    try {
      const response = await fetch(`${getDomainBasedOnEnvironment()}/api/v1/${api}`, options);
      const responseData: Response = await response.json();

      return responseData;
    } catch (error) {
      console.error('Error fetching data:', error);
      return {
        response: {
          statusCode: HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
          message: `Error fetching data: ${error}`,
          data: [],
        }
      };
    }
  };

  return {
    get: (): Promise<Response> => {
      options.method = 'GET';
      return request(options);
    },

    post: (): Promise<Response> => {
      options.method = 'POST';
      return request(options);
    },

    delete: (): Promise<Response> => {
      options.method = 'DELETE';
      return request(options);
    },

    put: (): Promise<Response> => {
      options.method = 'PUT';
      return request(options);
    },

    patch: (): Promise<Response> => {
      options.method = 'PATCH';
      return request(options);
    },
  };
};

/**
 * Determines if the current environment is development.
 * @returns {boolean} True if the environment is development, otherwise false.
 */
const isDev = (): boolean =>
  process.env.NODE_ENV
    ? process.env.NODE_ENV.includes('development')
    : false;

/**
 * Formats a phone number into a standard (XXX) XXX-XXXX format.
 * @param {string} [phoneNumber=''] - The phone number to format.
 * @returns {string} The formatted phone number.
 */
const formatPhoneNumber = (phoneNumber: string = ''): string =>
  phoneNumber
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');

/**
 * Fetches data from a service and dispatches the result to a reducer.
 * @param {Data} params - The parameters for the data fetch.
 * @returns {Promise<void>} A promise that resolves when the data fetch is complete.
 */
const getData = async (
  {
    token,
    service,
    success,
    error = () => { },
    modal: { dispatch, text = '' }
  }: Data
): Promise<void> => {
  dispatch({ type: SET_LOAD, payload: { text, canShow: true } });
  const { response: { statusCode, data } }: Response = await send({ api: service.endpoint, token })[service.method]();
  statusCode === HTTP_STATUS_CODES.OK && success(data);
  statusCode === HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR && error();
  dispatch({ type: CLEAR_LOAD });
}

/**
 * Checks the pronunciation of each word in a sentence and highlights mismatches.
 *
 * @param {string} [sentence=''] - The sentence to be checked.
 * @param {string} [pronunciation=''] - The expected pronunciation, with words separated by spaces.
 * @param {boolean} [canShow=false] - Determines whether to perform the check or return the original sentence.
 * @returns {JSX.Element | string} - If `canShow` is true, returns a JSX element with each word styled based on pronunciation match. Otherwise, returns the original sentence as a string.
 *
 * @example
 * // Renders the sentence with words underlined in red if they don't match the pronunciation.
 * checkPronunciation('Hello world', 'hello word', true);
 *
 * @example
 * // Returns the original sentence as a string because `canShow` is false.
 * checkPronunciation('Hello world', 'hello word', false); 
 */
const checkPronunciation = (
  sentence: string = '',
  pronunciation: string = '',
  canShow: boolean = false
): JSX.Element | string => {

  if (!canShow) {
    return sentence
  }

  const formattedWords: string[] = removeAccents(formatWord(sentence)).split(' ');
  const pronunciations: string[] = pronunciation.toLowerCase().split(' ');
  const spliteWords: string[] = sentence.split(' ');

  return (
    <>
      {formattedWords.map((word: string, index: number): JSX.Element => {
        const isFirstWord: boolean = index === 0;
        let isMismatch: boolean = pronunciations.includes(word);

        if (isMismatch && (formattedWords.length === pronunciations.length)) {
          isMismatch = word === pronunciations[index];
        }

        const style: any = {
          borderBottom: isMismatch ? 'none' : '2px solid red',
          textTransform: isFirstWord ? 'capitalize' : 'none'
        };

        const canAddSpace = (condiction: boolean): string =>
          condiction ? ' ' : '';

        return <span key={index} style={style}>
          {canAddSpace(index !== 0)}{spliteWords[index]}{canAddSpace(index !== formattedWords.length - 1)}
        </span>;
      })}
    </>
  );
};

const Cookie = {
  /**
 * Retrieves a cookie by name.
 * @param {string} name - The name of the cookie to retrieve.
 * @returns {string | null} The value of the cookie or null if not found.
 */
  get: (name: string): string | null => {
    const value: string = `; ${document.cookie}`;
    const parts: string[] = value.split(`; ${name}=`);

    return parts.length === 2 ? (parts.pop()?.split(';').shift() || null) : null;
  },

  /**
  * Sets a cookie with the specified name, value, and expiration days.
  * @param {string} name - The name of the cookie to set.
  * @param {string} value - The value of the cookie.
  * @param {number} [days=7] - The number of days until the cookie expires.
  */
  set: (name: string, value: string, days: number = 7): void => {
    const expires: Date = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
  },

  /**
   * Removes a cookie by name.
   * @param {string} name - The name of the cookie to remove.
   */
  remove: (name: string): void => {
    document.cookie = `${name}=; Max-Age=-99999999; path=/`;
  }
};

const Storage = {
  /**
   * Sets a value in local storage by key.
   * @param {string} key - The key under which to store the value.
   * @param {any} value - The value to store in local storage.
   */
  set: (key: string, value: any): void => {
    const jsonValue = JSON.stringify(value);
    localStorage.setItem(key, jsonValue);
  },

  /**
   * Removes a value from local storage by key.
   * @param {string} key - The key of the value to remove.
   */
  remove: (key: string): void => {
    localStorage.removeItem(key);
  },

  /**
   * Retrieves a value from local storage by key.
   * @param {string} key - The key of the value to retrieve.
   * @returns {any} The retrieved value or null if not found.
  */
  get: (key: string): any => {
    const jsonValue = localStorage.getItem(key);
    return jsonValue ? JSON.parse(jsonValue) : null;
  },

  /**
   * Clears all values from local storage.
   */
  clear: (): void => {
    localStorage.clear();
  }
};

/**
 * Checks if there is a logged-in user.
 * @returns {boolean} True if there is a logged-in user, otherwise false.
 */
const isUser = (): boolean => {
  const [{ user }] = useContext(context);

  return !!user;
}

/**
 * Checks if the user has an admin role.
 * @param {User | null} user - The user object to check.
 * @returns {boolean} True if the user has an admin role, otherwise false.
 */
const isAdmin = (user: User | null): boolean =>
  user?.role === ROLE.ADMIN;

/**
 * Checks if the user has a free role.
 * @param {User | null} user - The user object to check.
 * @returns {boolean} True if the user has a free role, otherwise false.
 */
const isFree = (user: User | null): boolean =>
  user?.role === ROLE.FREE;

/**
 * Checks if the user has a student role.
 * @param {User | null} user - The user object to check.
 * @returns {boolean} True if the user has a student role, otherwise false.
 */
const isStudent = (user: User | null): boolean =>
  user?.role === ROLE.STUDENT;

/**
 * Gets the path for a WordPress asset based on the filename.
 * @param {string} filename - The filename of the asset.
 * @returns {string} The full path to the asset.
 */
const gethPathWordpress = (filename: string): string =>
  `https://coachingresourcecenter.com/wp-content/uploads/easyonlineenglish/${filename}`;

/**
 * Formats a word by converting it to lowercase and removing any non-alphanumeric characters.
 * @param {string} word - The word to format.
 * @returns {string} The formatted word.
 */
const formatWord = (word: string): string =>
  word.toLowerCase().replace(/[^\w ']/g, '');

/**
 * Removes accents from a string.
 * @param {string} str - The string from which to remove accents.
 * @returns {string} The string with accents removed.
 */
const removeAccents = (str: string): string =>
  str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

/**
 * Gets the appropriate domain based on the current environment.
 * @returns {string} The domain URL.
 */
const getDomainBasedOnEnvironment = (): string =>
  isDev() && process.env.HOST_DEV ? process.env.HOST_DEV : '';

/**
 * Gets the appropriate credentials setting for fetch requests based on the current environment.
 * @returns {'include' | 'same-origin'} The credentials setting.
 */
const getFetchCredentialsBasedOnEnvironment = (): 'include' | 'same-origin' =>
  isDev() ? 'include' : 'same-origin';

/**
 * Constructs a className string from multiple class name parts.
 * @param {...string} props - The class name parts to concatenate.
 * @returns {string} The concatenated class name string.
 */
const getClassName = (...props: string[]): string => {
  let classes: string = '';

  for (let prop of props)
    if (prop) classes += `${prop} `;

  return classes.trim();
}

const getFeedbackMessage = () => {
  const messagesCorrect: string[] = [
    '¡Correcto!',
    '¡Bien!',
    '¡Vas bien!',
    '¡Vas muy bien!',
    '¡Sigue así!',
    '¡Perfecto!',
    '¡Bien hecho!',
    '¡Te felicito!',
    '¡Sigue avanzando!',
    '¡Super bien!',
    '¡Excelente!'
  ];

  const messagesWrong: string[] = [
    '¡Vuelve a intentarlo!',
    '¡Estuvo cerca! Lo puedes hacer mejor.',
    '¡Buen intento! ¿Qué tal una vez más?',
    '¡Bien! ¿Lo intentamos de nuevo?',
    '¡Intentamos nuevamente!',
  ];

  const getMessage = (messages: string[]) =>
    `${messages[Math.floor(Math.random() * messages.length)]}`;

  return {
    correct: getMessage(messagesCorrect),
    wrong: getMessage(messagesWrong)
  };
};

export {
  send,
  formatPhoneNumber,
  isDev,
  getData,
  isUser,
  isAdmin,
  gethPathWordpress,
  isFree,
  isStudent,
  formatWord,
  removeAccents,
  uploadBlob,
  getClassName,
  Storage,
  Cookie,
  checkPronunciation,
  getFeedbackMessage,
  getDomainBasedOnEnvironment
};
