import { useContext } from 'react';
import { CLEAR_LOAD, SET_LOAD } from '../global/state/actionTypes';
import { ASSETS_URL, HTTP_STATUS_CODES, ROLE } from './constant';
import { Request, RequestOptions, Send, Store, Response, Data } from './type';
import context from '../global/state/context';
import { User } from '../global/state/type';

const uploadBlob = async ({ service, file }: { service: string; file: any; }): Promise<string> => {
  if (!file) return '';

  try {
    const formData: FormData = new FormData();
    const [fileName] = file.name.split('.');

    formData.append('photo', file);

    const { response: { data, statusCode } } = await fetch(
      `${getDomainBasedOnEnvironment()}/api/v1/${service}?filename=${fileName}.avif`,
      {
        method: 'POST',
        body: formData,
        credentials: getFetchCredentialsBasedOnEnvironment(),
      }
    ).then(response => response.json());

    return statusCode === HTTP_STATUS_CODES.OK ? data : '';
  } catch(error) {
    console.error('Error uploading file:', error);
    return ''
  }
}

const send = ({ api, data, token }: Request): Send => {
  const options: RequestOptions = {
    headers: {
      //"ngrok-skip-browser-warning": "69420",
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    credentials: "include",
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

const isDev = (): boolean =>
  process.env.NODE_ENV
    ? process.env.NODE_ENV.includes('development')
    : false;

const store: Store = {
  get: (value: string): string | null | { [key: string]: any; } =>
    localStorage.getItem(value),

  set: (key: string, value: string | { [key: string]: any }): void => {
    if (typeof value === 'string') {
      localStorage.setItem(key, value);
    } else {
      localStorage.setItem(key, JSON.stringify(value));
    }
  },

  del: (key: string): void => {
    localStorage.removeItem(key);
  }
}

const formatPhoneNumber = (phoneNumber: string = ''): string =>
  phoneNumber
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');

const getData = async (
  {
    token,
    service,
    success,
    modal: { dispatch, text = '' }
  }: Data
): Promise<void> => {
  dispatch({ type: SET_LOAD, payload: { text, canShow: true } });
  const { response: { statusCode, data } }: Response = await send({ api: service.endpoint, token })[service.method]();
  statusCode === HTTP_STATUS_CODES.OK && success(data);
  dispatch({ type: CLEAR_LOAD });
}

const cookie = {
  set(
    name: string,
    value: string,
    days?: number,
    path: string = "/",
    domain?: string,
    secure?: boolean
  ) {
    let cookieString: string = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

    if (days) {
      const date: Date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      cookieString += `; expires=${date.toUTCString()}`;
    }

    if (path) {
      cookieString += `; path=${path}`;
    }

    if (domain) {
      cookieString += `; domain=${domain}`;
    }

    if (secure) {
      cookieString += `; secure`;
    }

    document.cookie = cookieString;
  },

  get(name: string): string | null {
    const nameEQ = encodeURIComponent(name) + "=";
    const cookies = document.cookie.split(';');

    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i];

      while (cookie.charAt(0) === ' ') {
        cookie = cookie.substring(1, cookie.length);
      }

      if (cookie.indexOf(nameEQ) === 0) {
        return decodeURIComponent(cookie.substring(nameEQ.length, cookie.length));
      }
    }

    return null;
  }
}

const isUser = (): boolean => {
  const [{ user }] = useContext(context);

  return !!user;
}

const initGoogleAnalytics = (): any => {
  // @ts-ignore
  window.dataLayer = window.dataLayer || [];

  function gtag() {
    // @ts-ignore
    dataLayer.push(arguments);
  }

  // @ts-ignore
  gtag('js', new Date());

  // @ts-ignore
  gtag('config', 'G-7K5EX1R6FM');

  return gtag;
};

const isAdmin = (user: User | null): boolean =>
  user?.role === ROLE.ADMIN;

const isFree = (user: User | null): boolean =>
  user?.role === ROLE.FREE;

const isStudent = (user: User | null): boolean =>
  user?.role === ROLE.STUDENT;

const gethPathWordpress = (filename: string): string =>
  `${ASSETS_URL}${filename}`;

const formatWord = (word: string): string =>
  word.toLowerCase().replace(/[^\w ]/g, '');

const removeAccents = (str: string): string =>
  str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

export const getDomainBasedOnEnvironment  = (): string  =>
  isDev() ? 'https://7be5-148-0-134-107.ngrok-free.app' : '';

const getFetchCredentialsBasedOnEnvironment = (): 'include' | 'same-origin' =>
  isDev() ? 'include' : 'same-origin';

const getClassName = (...props: string[]): string => {
  let classes: string = '';

  for (let index in props) {
    classes += props[index] + (Number(index) < props.length - 1 ? ' ' : '');
  }

  return classes;
}

export {
  send,
  store,
  formatPhoneNumber,
  isDev,
  getData,
  cookie,
  isUser,
  initGoogleAnalytics,
  isAdmin,
  gethPathWordpress,
  isFree,
  isStudent,
  formatWord,
  removeAccents,
  uploadBlob,
  getClassName
};
