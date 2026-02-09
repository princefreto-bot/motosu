const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: String,
  userEmail: String,
  userPhone: String,
  amount: { type: Number, required: true },
  screenshot: String,
  transactionId: String,
  phoneUsed: String,
  status: { type: String, enum: ['pending', 'validated', 'rejected'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
