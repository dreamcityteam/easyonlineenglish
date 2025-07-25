import { Dispatch } from 'react';
import { HTTP_STATUS_CODES } from './constant';

type Request = {
  api: string;
  data?: object;
  token?: string;
}

type Role = {
  ADMIN: 'ADMIN';
  STUDENT: 'STUDENT';
  FREE: 'FREE';
}

type StatusCode = {
  OK: 200;
  CREATED: 201;
  INTERNAL_SERVER_ERROR: 500;
  BAD_REQUEST: 400;
  UNAUTHORIZED: 401;
  NOT_FOUND: 404;
  TEMPORARY_REDIRECT: 307;
};

type RequestOptions = {
  method: string;
  credentials: 'same-origin' | 'include', 
  headers: {
    'Content-Type': string;
    Authorization?: string;
  };
  body?: string;
}

type Response = {
  response: {
    statusCode: 
      typeof HTTP_STATUS_CODES.OK |
      typeof HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR |
      typeof HTTP_STATUS_CODES.BAD_REQUEST |
      typeof HTTP_STATUS_CODES.UNAUTHORIZED |
      typeof HTTP_STATUS_CODES.NOT_FOUND |
      typeof HTTP_STATUS_CODES.TEMPORARY_REDIRECT;
    data: any;
    message: string;
  }
}

type Send = {
  get: () => Promise<Response>;
  post: () => Promise<Response>;
  delete: () => Promise<Response>;
  put: () => Promise<Response>;
  patch: () => Promise<Response>;
}

type Data = {
  token?: string | undefined;
  service: {
    method: 'get' | 'post' | 'put' | 'delete';
    endpoint: string;
  };
  success: (data: any) => void;
  error?: () => void;
  modal: {
    dispatch: Dispatch<any>;
    text?: string;
  };
};

type ObjectValueString = {
  [key: string]: string;
};

type Validator = {
  message: string;
  regExp: RegExp;
};

type ObjectValuValidator = {
  [key: string]: Validator;
};

export type {
  Request,
  RequestOptions,
  Send,
  Response,
  StatusCode,
  Role,
  Data,
  ObjectValueString,
  ObjectValuValidator
}