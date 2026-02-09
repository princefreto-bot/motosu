const mongoose = require('mongoose');

const withdrawalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: String,
  userPhone: String,
  amount: { type: Number, required: true },
  method: { type: String, enum: ['moov', 'mix'], required: true },
  accountNumber: { type: String, required: true },
  accountName: String,
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  approvedAt: Date
}, { timestamps: true });

module.exports = mongoose.model('Withdrawal', withdrawalSchema);
