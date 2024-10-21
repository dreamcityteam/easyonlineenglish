import mongoose, { Schema } from 'mongoose';

const courseSchema = new Schema({
  AzulOrderId: {
    type: String,
    unique: true
  },
  orderId: {
    type: String,
    unique: true
  },
  hasSpecialServiceList: {
    type: Boolean,
    default: false
  },
  transactionResp: {
    type: Array,
    default: []
  },
  paymentInformation: {
    type: Object,
    default: {}
  },
  notificationEmails: {
    type: [String],
    default: []
  },
  statusMSG: {
    type: String,
    default: 'processing'
  },
  approved: {
    type: Boolean,
    default: false
  },
  amount: {
    type: Number
  },
  itbis: {
    type: Number
  },
  threeDSResponse: {
    type: String,
    default: ''
  }
}, { timestamps: true });

const AzulTransactionResp = mongoose.model('AzulTransactionResp', courseSchema);

export default AzulTransactionResp;
