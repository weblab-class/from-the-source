const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    default: 'Nationwide'
  },
  cuisine: {
    type: String,
    enum: ['american', 'mexican', 'asian', 'italian', 'bbq', 'fast-food', 'middle-eastern', 'dessert', 'other'],
    default: 'other'
  },

  recipesUnlocked: {
    type: Number,
    default: 0
  },
  activeBounties: {
    type: Number,
    default: 0
  },
  averageAccuracy: {
    type: Number,
    default: null
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Restaurant', restaurantSchema);
