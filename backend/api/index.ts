import dotenv from 'dotenv';
dotenv.config();

import express, { Express } from 'express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import cors from 'cors';
import router from '../routers/index';
import {
  isDev,
  connectToDatabase,
  initialDatabase
} from '../tools/functions';
import middlewareToken from '../middlewares/token';
import middlewareCache from '../middlewares/cache';
import middlewareImage from '../middlewares/image';

const app: Express = express();
const PORT: number = 3000;
const { DEV_HOST = '' } = process.env;

connectToDatabase().then(() => {
  initialDatabase();
});

if (isDev()) {
  app.use(cors({
    origin: DEV_HOST,
    credentials: true,
  }));
}

app.use(helmet({
  crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' },
}));

app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: false }));
app.use(middlewareToken);
app.use(middlewareCache);
app.use(middlewareImage);
app.use('/api/v1', router);

if (isDev()) {
  app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
} else {
  // En Vercel, configurar archivos estáticos pero no llamar serveApp
  const path = require('path');
  const BUILD_PATH = '../build';
  app.use(express.static(path.join(__dirname, BUILD_PATH)));

  // Manejar SPA routing - servir index.html para rutas no-API
  app.get('*', (req: any, res: any) => {
    if (req.path.startsWith('/api')) {
      return res.status(404).json({ message: 'API endpoint not found' });
    }
    res.sendFile(path.resolve(__dirname, BUILD_PATH, 'index.html'));
  });
}

export default app;
