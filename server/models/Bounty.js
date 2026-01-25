const mongoose = require('mongoose');

const bountySchema = new mongoose.Schema({
  // Basic info
  dishName: {
    type: String,
    required: true,
    trim: true
  },
  restaurant: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    default: 'Nationwide'
  },
  description: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    enum: ['mexican', 'italian', 'asian', 'american', 'vietnamese', 'japanese', 'middle eastern', 'deli', 'others'],
    default: 'other'
  },

  // Points and status
  pointReward: {
    type: Number,
    default: 100,
    min: 50,
    max: 1000
  },
  status: {
    type: String,
    enum: ['open', 'claimed', 'completed'],
    default: 'open'
  },

  // Tracking who's involved
  postedBy: {
    type: String,  
    default: 'anonymous'
  },
  claimedBy: {
    type: String,
    default: null
  },
  wantedBy: [{
    type: String  
  }],

  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  claimedAt: {
    type: Date,
    default: null
  }
});

bountySchema.virtual('wantCount').get(function() {
  return this.wantedBy.length;
});

bountySchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Bounty', bountySchema);
