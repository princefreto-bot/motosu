const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  platform: { type: String, enum: ['youtube', 'tiktok'], required: true },
  title: { type: String, required: true },
  url: { type: String, required: true },
  videoId: { type: String },
  duration: { type: Number, required: true },
  reward: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Video', videoSchema);
