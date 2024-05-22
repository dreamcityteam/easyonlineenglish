const mongoose = require('mongoose');
const { Schema } = mongoose;

const userTokenSchema = new Schema({
  idUser: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  token: {
    type: String,
    required: true,
  },

  type: {
    type: String,
    enum: ['PASSWORD', 'AUTH'],
    default: 'PASSWORD',
  },
});

const UserToken = mongoose.model('UserToken', userTokenSchema);

module.exports = UserToken;
