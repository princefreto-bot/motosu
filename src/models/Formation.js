const mongoose = require('mongoose');

const formationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  link: { type: String, required: true },
  image: { type: String, default: '' },
  category: { type: String, default: 'Général' },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Formation', formationSchema);
