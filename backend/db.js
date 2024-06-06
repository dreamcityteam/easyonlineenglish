const mongoose = require('mongoose');

const { MONGODB_URI_PRODUCTION } = process.env;

let isConnected;

const connectToDatabase = async () => {
  if (isConnected) {
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI_PRODUCTION, {
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
