import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema({
  orderId: {
    type: String,
    require: true
  },
  idUser: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fullName: {
    type: String,
    required: true
  },
  plan: {
    type: String,
    required: true,
    enum: [1, 2, 3, 4],
  },
  dateStart: {
    type: Date,
    default: Date.now,
  },
  dateEnd: {
    type: Date,
    required: true
  },
  type: {
    type: String,
    enum: ['PAYPAL', 'AZUL'],
    required: true
  },
  amount: {
    type: String,
    required: true,
  }
});

const StudentPayment = mongoose.model('StudentPayment', userSchema);

export default StudentPayment;
