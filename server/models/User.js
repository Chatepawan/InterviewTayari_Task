// server/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define User Schema
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true // Ensures email is stored in lowercase
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  sqlPrepPlan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SQLPrepPlan' // Reference to SQL preparation plan
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving the user
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next(); // Skip if password is unchanged
  this.password = await bcrypt.hash(this.password, 10); // Hash password with salt rounds
  next();
});

// Method to compare passwords
UserSchema.methods.comparePassword = function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Export User model
module.exports = mongoose.model('User', UserSchema);
