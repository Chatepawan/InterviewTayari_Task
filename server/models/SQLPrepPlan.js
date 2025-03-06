const mongoose = require('mongoose');

const SQLPrepPlanSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  yearsOfExperience: {
    type: Number,
    required: true
  },
  currentCTC: {
    type: String,
    required: true
  },
  targetCompanies: [String],
  timeCommitment: {
    type: String,
    required: true
  },
  questions: [{
    title: String,
    difficulty: String,
    concepts: [String], // Added field
    description: String, // Added field
    category: String,
    completed: {
      type: Boolean,
      default: false
    }
  }],
  generatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('SQLPrepPlan', SQLPrepPlanSchema);