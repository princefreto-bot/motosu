const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  type: { 
    type: String, 
    enum: ['sondage', 'verification', 'classification', 'transcription'], 
    required: true 
  },
  title: { type: String, required: true },
  description: { type: String, required: true },
  reward: { type: Number, required: true },
  content: { type: mongoose.Schema.Types.Mixed, required: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
