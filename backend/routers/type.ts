import { Response, NextFunction } from 'express';
import { RequestType } from '../tools/type';

type Router = {
  path: string;
  method: 'get' | 'post' | 'patch' | 'delete' | 'put';
  func: (req: RequestType, res: Response, next: NextFunction) => void;
};

export type {
  Router
};
