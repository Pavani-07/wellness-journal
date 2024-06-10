const mongoose = require('mongoose');

const goalsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true
  },
  goal: {
    type: String,
    required: true
  },
  deadline: {
    type: Date,
    required: true
  },
  completed: {
    type: Boolean,
    default: false 
  }
});

const GoalsModel = mongoose.model('Goals', goalsSchema);

module.exports = GoalsModel;
