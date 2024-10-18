import express, { Router } from 'express';
import config from './config';
import { Router as RouterType } from './type'

const router: Router = express.Router();

config.forEach(({ method, path, func }: RouterType): void => {
  // @ts-ignore
  router[method](`/${path}`, func);
});

export default router;
