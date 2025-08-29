import jwt from 'jsonwebtoken';
import { send, getResponse } from '../../tools/functions';
import { HTTP_STATUS_CODES } from '../../tools/consts';
import { Request } from 'express';
import { TokenOpcion } from './type';

const {
  ACCESS_KEY_TOKEN = ''
} = process.env;

const verifyToken = ({ req, res, next, authenticator }: TokenOpcion, token: string): any => {
  const response = getResponse(res, 'Invalid token.');

  try {
    // @ts-ignore
    req.user = jwt.verify(token, ACCESS_KEY_TOKEN);
    // @ts-ignore
    req.token = token;
    return next();
  } catch (error) {
    authenticator.remove();
    response.statusCode = HTTP_STATUS_CODES.UNAUTHORIZED;
    return send(response);
  }
};

const getTokenFromHeader = (req: Request): string | null => {
  const authorizationHeader = req.header('Authorization');

  if (!authorizationHeader) return null;
  const [, token] = authorizationHeader.split(' ');
  return token;
};

const url = (req: Request): (urls: string[]) => boolean =>
  (urls: string[]) =>
    urls.some((url: string) => {
      // Update regex to allow query parameters
      const regexp = new RegExp(`^/api/v1/${url}/?(\\?.*)?$`);
      const { originalUrl } = req;
      
      // Test if originalUrl matches the dynamic regex
      return regexp.test(originalUrl);
    });

export {
  getTokenFromHeader,
  verifyToken,
  url
};
