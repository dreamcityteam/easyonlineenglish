import { Request, Response, NextFunction } from 'express';

const endpoint = async (_: Request, res: Response, next: NextFunction): Promise<void> => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
}

export default endpoint;
