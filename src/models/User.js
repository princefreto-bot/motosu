const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String, required: true, trim: true },
  password: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'pending_payment', 'validated', 'rejected'], 
    default: 'pending' 
  },
  isAdmin: { type: Boolean, default: false },
  balance: { type: Number, default: 0 },
  earnings: { type: Number, default: 0 },
  referralCode: { type: String, unique: true },
  referredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  completedTasks: [{ type: String }],
  watchedVideos: [{ type: String }],
  tasksCompletedToday: [{ type: String }],
  lastTaskDate: { type: String, default: null },
  subscriptionDate: { type: Date, default: null },
  paymentProof: {
    screenshot: String,
    transactionId: String,
    phoneUsed: String,
    submittedAt: Date
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
