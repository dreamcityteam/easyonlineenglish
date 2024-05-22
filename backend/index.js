require('dotenv').config();

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const routers = require('./routers');
const mongoose = require('mongoose');
const middlewareToken = require('./middleware/token');
const initialDatabase = require('./initialDatabase');

const {
  DB_USERNAME,
  DB_PASSWORD,
  DB_CLUSTER,
  DB_NAME,
  DB_PARAMS,
} = process.env;

const DB_URI = `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@${DB_CLUSTER}/${DB_NAME}?${DB_PARAMS}`;

mongoose.connect(DB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    initialDatabase();
  })
  .catch(error => {
    console.error('Error connecting to MongoDB:', error.message);
  });

const app = express();
const BUILD_PATH = './build';
const { PORT = 3000 } = process.env;

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

app.use(express.static(path.join(__dirname, BUILD_PATH)));

// Server React SPA
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, BUILD_PATH, 'index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log('Server is running on port', PORT);
});
