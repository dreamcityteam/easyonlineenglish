require('dotenv').config();

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const routers = require('../routers');
const middlewareToken = require('../middleware/token');
const initialDatabase = require('../initialDatabase');
const connectToDatabase = require('../db');

connectToDatabase().then(() => {
  initialDatabase();
});

const app = express();
const BUILD_PATH = '../build';
const { PORT = 3000, NODE_ENV } = process.env;

app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(middlewareToken);
app.use('/api/v1', routers);

app.use((_req, res, next) => {
  res.setHeader('Content-Security-Policy', "img-src 'self' data: *");
  next();
});

// Static assets configuration
const staticOptions = {
  maxAge: 0, // Disable caching for static assets
};
app.use(express.static(path.join(__dirname, BUILD_PATH), staticOptions));

// Disable caching for index.html
app.get('/', (_req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  next();
});

app.get('*', (_, res) => {
  res.sendFile(path.resolve(__dirname, BUILD_PATH, 'index.html'));
});

if (NODE_ENV && NODE_ENV.includes('DEVELOPMENT')) {
  app.listen(PORT, () => {
    console.log('Server is running on port', PORT);
  });  
} else {
  module.exports = app;
}
