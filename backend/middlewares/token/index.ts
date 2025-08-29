import { NextFunction, Request, Response } from 'express';
import { auth, getResponse, send } from '../../tools/functions';
import { getTokenFromHeader, url, verifyToken } from './functions';
import { TokenOpcion } from './type';
import {
  avoidTokenEndpoints,
  tokenFromHeaderEndpoints,
  tokenFromCookieEndpoints,
  removeTokenAndAvoidEndpoint
} from './data';

const endpoint = async (req: Request, res: Response, next: NextFunction) => {
  const response = getResponse(res, 'Invalid token.');
  const authenticator = auth(res, req);
  const checkEndPoints = url(req);
  const { originalUrl: URL } = req;
  const tokenFromHeader = getTokenFromHeader(req);
  const tokenFromCookie = authenticator.get();
  const verifyTokenOpcion: TokenOpcion = { req, res, next, authenticator };

  if (checkEndPoints(avoidTokenEndpoints)) return next();

  if (
    tokenFromHeader &&
    checkEndPoints(tokenFromHeaderEndpoints)
  ) return verifyToken(verifyTokenOpcion, tokenFromHeader);

  if (
    tokenFromCookie && (
      checkEndPoints(tokenFromCookieEndpoints) ||
      /^\/student-course\/\w/.test(URL) ||
      /^\/upload-file(?:\?filename=[^&]*)?$/.test(URL) ||
      /^\/student-photo(?:\?filename=[^&]*)?$/.test(URL)
    )
  ) return verifyToken(verifyTokenOpcion, tokenFromCookie);


  if (checkEndPoints(removeTokenAndAvoidEndpoint)) {
    authenticator.remove();
    return next();
  }

  // Si llegamos aquí y no es un endpoint válido, enviar error
  return send(response);

  return next();
};

export default endpoint;
