import mongoose, { Schema } from 'mongoose';

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
    enum: ['PASSWORD', 'AUTH', 'ACTIVE_ACCOUNT'],
    default: 'PASSWORD',
  },
});

const UserToken = mongoose.model('UserToken', userTokenSchema);

export default UserToken;
