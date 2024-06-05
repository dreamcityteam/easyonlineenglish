const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },

  name: {
    type: String,
    required: true,
  },

  lastname: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    unique: true,
    required: true,
  },

  phone: {
    type: String,
  },

  password: {
    type: String,
    required: true,
  },

  photo: {
    type: String,
    default: '',
  },

  role: {
    type: String,
    enum: ['ADMIN', 'STUDENT'],
    default: 'STUDENT',
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  updatedAt: {
    type: Date,
    default: Date.now,
  },

  deleted: {
    type: Boolean,
    default: false,
  },

  isTutorial: {
    type: Boolean,
    default: true,
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
