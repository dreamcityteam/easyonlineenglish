require('dotenv').config();

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const cors = require('cors');
const routers = require('../routers');
const middlewareToken = require('../middleware/token');
const removeCache = require('../middleware/cache');
const initialDatabase = require('../initialDatabase');
const connectToDatabase = require('../db');
const { isDev } = require('../tools/functions');

connectToDatabase().then(() => {
  initialDatabase();
});

const app = express();
const BUILD_PATH = '../build';
const { PORT = 3000 } = process.env;

app.use(helmet({
  crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' },
}));

if (isDev()) {
  app.use(cors({
    origin: 'http://localhost:8080',
    credentials: true
  }));
}

app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: false }));
app.use(middlewareToken);
app.use('/api/v1', routers);
app.use(removeCache);

app.use((_req, res, next) => {
  res.setHeader('Content-Security-Policy', "img-src 'self' data: *");
  next();
});

if (isDev()) {
  app.listen(PORT, () => console.log('Server is running on port', PORT));
} else {
  app.use(express.static(path.join(__dirname, BUILD_PATH)));

  app.get('*', (_, res) => {
    res.sendFile(path.resolve(__dirname, BUILD_PATH, 'index.html'));
  });

  module.exports = app;
}
