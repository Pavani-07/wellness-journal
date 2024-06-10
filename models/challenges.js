const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  link : {type: String}
});

const ChallengeModel = mongoose.model('Challenge', challengeSchema);

module.exports = ChallengeModel;
