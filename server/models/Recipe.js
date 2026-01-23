const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  bountyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bounty',
    required: true
  },

  dishName: {
    type: String,
    required: true
  },
  restaurant: {
    type: String,
    required: true
  },

  ingredients: [{
    type: String
  }],
  steps: [{
    type: String
  }],

  questLog: {
    type: String,
    required: true
  },
  difficultyTag: {
    type: String,
    enum: ['asked-employee', 'reverse-engineered', 'found-ex-employee', 'multiple-attempts', 'other'],
    default: 'other'
  },

  submittedBy: {
    type: String,
    default: 'anonymous'
  },

  verifications: [{
    verifiedBy: String,
    method: {
      type: String,
      enum: ['recreated', 'confirmed-with-restaurant']
    },
    accuracyRating: {
      type: Number,
      min: 1,
      max: 10
    },
    notes: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],

  createdAt: {
    type: Date,
    default: Date.now
  }
});


recipeSchema.virtual('accuracyScore').get(function() {
  if (this.verifications.length === 0) return null;
  const sum = this.verifications.reduce((acc, v) => acc + v.accuracyRating, 0);
  return Math.round((sum / this.verifications.length) * 10);
});

recipeSchema.virtual('verificationCount').get(function() {
  return this.verifications.length;
});

recipeSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Recipe', recipeSchema);
