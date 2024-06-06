const mongoose = require('mongoose');

const {
  DB_USERNAME,
  DB_PASSWORD,
  DB_CLUSTER,
  DB_NAME,
  DB_PARAMS,
} = process.env;

const DB_URI = `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@${DB_CLUSTER}/${DB_NAME}?${DB_PARAMS}`;

let isConnected;

const connectToDatabase = async () => {
  if (isConnected) {
    return;
  }

  try {
    await mongoose.connect(DB_URI, {
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
