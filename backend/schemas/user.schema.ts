import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema({
  googleId: {
    type: String,
    default: null,
  },
  username: {
    type: String,
    required: function () {
      // @ts-ignore
      return !this.googleId;
    },
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
    required: function () {
      // @ts-ignore
      return !this.googleId;
    },
  },
  photo: {
    type: String,
    default: ''
  },
  role: {
    type: String,
    enum: ['ADMIN', 'STUDENT', 'FREE'],
    default: 'FREE',
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
  },
  isTerms: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true
  },
});

const User = mongoose.model('User', userSchema);

export default User;
