import { Response, Request } from 'express';
import { HTTP_STATUS_CODES, ROLE } from './consts';
import { ObjectId } from 'mongodb';

type ObjectValueString = {
  [key: string]: string;
};

type ObjectValueNumber = {
  [key: string]: number;
};

type ObjectValuValidator = {
  [key: string]: Validator;
};

type HttpStatusCodes = {
  OK: 200;
  INTERNAL_SERVER_ERROR: 500;
  BAD_REQUEST: 400;
  UNAUTHORIZED: 401;
  NOT_FOUND: 404;
  TEMPORARY_REDIRECT: 307;
};

type Roles = {
  ADMIN: 'ADMIN';
  STUDENT: 'STUDENT';
  FREE: 'FREE';
};

type Validators = {
  USERNAME: Validator;
  EMAIL: Validator;
  PHONE_NUMBER: Validator;
  NAME: Validator;
  LAST_NAME: Validator;
  PASSWORD: Validator;
};

type Messages = {
  SUCCESSFUL: 'Successful!'
};

type Token = {
  _id: ObjectId;
  type?: 'auth' | 'password' | 'active-account';
  expiresIn?: string;
  role?: (
    typeof ROLE.ADMIN |
    typeof ROLE.STUDENT
  ),
};

type ResponseSend = {
  res: Response;
  statusCode?: (
    typeof HTTP_STATUS_CODES.OK |
    typeof HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR |
    typeof HTTP_STATUS_CODES.BAD_REQUEST |
    typeof HTTP_STATUS_CODES.UNAUTHORIZED |
    typeof HTTP_STATUS_CODES.NOT_FOUND |
    typeof HTTP_STATUS_CODES.TEMPORARY_REDIRECT
  );
  data?: any;
  message?: string;
};

type Cookie = {
  res: Response,
  value: string;
  expires?: number;
};

type Location = {
  country: string;
  city: string;
  region: string;
};

type Validator = {
  message: string;
  regExp: RegExp;
};

type TryCatch = {
  res: Response;
  message: string;
  endpoint: (response: ResponseSend) => Promise<any>;
};

type RequestType = Request & {
  token: string | undefined;
  user: {
    type: string; _id: string | ObjectId;
  };
};

type SendEmailProps = {
  from: string;
  html: string;
  subject: string;
  to: string;
};

type UploadBlodToVercelProps = {
  filename: string;
  file: Buffer | undefined;
  size?: {
    height: number;
    width: number;
  };
};

export type {
  ObjectValueString,
  ObjectValueNumber,
  ResponseSend,
  Token,
  Cookie,
  Location,
  Validator,
  ObjectValuValidator,
  TryCatch,
  RequestType,
  SendEmailProps,
  UploadBlodToVercelProps,
  HttpStatusCodes,
  Roles,
  Validators,
  Messages
};
