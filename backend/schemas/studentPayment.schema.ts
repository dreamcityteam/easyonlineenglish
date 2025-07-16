import { Schema, model, Document } from 'mongoose';

interface IStudentPayment extends Document {
  orderId: string;
  idUser: Schema.Types.ObjectId;
  fullName: string;
  plan: string;
  dateStart: Date;
  dateEnd: Date;
  type: 'PAYPAL' | 'STRIPE';
  amount: number;
  status: 'ACTIVE' | 'CANCELLED' | 'EXPIRED';
  cancelledAt?: Date;
  cancelReason?: string;
}

const studentPaymentSchema = new Schema<IStudentPayment>({
  orderId: { 
    type: String, 
    required: true,
    index: true 
  },
  idUser: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    index: true 
  },
  fullName: { 
    type: String, 
    required: true 
  },
  plan: { 
    type: String, 
    required: true,
    enum: ['1', '2', '3']
  },
  dateStart: { 
    type: Date, 
    default: Date.now 
  },
  dateEnd: { 
    type: Date, 
    required: true 
  },
  type: { 
    type: String, 
    required: true, 
    enum: ['PAYPAL', 'STRIPE'] 
  },
  amount: { 
    type: Number, 
    required: true,
    min: 0
  },
  status: { 
    type: String, 
    default: 'ACTIVE', 
    enum: ['ACTIVE', 'CANCELLED', 'EXPIRED'] 
  },
  cancelledAt: { 
    type: Date 
  },
  cancelReason: { 
    type: String,
    maxlength: 500
  }
}, {
  timestamps: true
});

// Índice compuesto para búsquedas eficientes
studentPaymentSchema.index({ orderId: 1, idUser: 1 });

export default model<IStudentPayment>('StudentPayment', studentPaymentSchema);
