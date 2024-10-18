import { NextFunction, Request, Response  } from 'express';

type TokenOpcion = {
  req: Request;
  res: Response;
  next: NextFunction;
  authenticator:  {
    remove: () => void;
    get: () => void;
  }
};

export type {
  TokenOpcion
};
