const mongoose = require('mongoose');
const { isDev } = require('./tools/functions');

const {
  MONGODB_URI_PRODUCTION,
  MONGODB_URI_DEVELOPMENT
} = process.env;

let isConnected;

const connectToDatabase = async () => {
  if (isConnected) {
    return;
  }

  try {
    const MONGODB_URI = isDev()
      ? MONGODB_URI_DEVELOPMENT
      : MONGODB_URI_PRODUCTION;

    await mongoose.connect(MONGODB_URI, {
      minPoolSize: 1,
      maxPoolSize: 1,
    });
    isConnected = mongoose.connections[0].readyState;
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
  }
}

module.exports = connectToDatabase;
