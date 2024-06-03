const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  idUser: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  name: {
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

  RRN: {
    type: String,
    required: true,
  },

  CustomOrderId: {
    type: String,
    required: true,
  },

  AzulOrderId: {
    type: String,
    required: true,
  },

  Ticket: {
    type: String,
    required: true,
  },

  amount: {
    type: Number,
    required: true,
  }
});

const StudentPayment = mongoose.model('StudentPayment', userSchema);

module.exports = StudentPayment;
