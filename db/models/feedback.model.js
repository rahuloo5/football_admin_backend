const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  name: {
    type: String,
  },

  email: {
    type: String,
  },

  message: {
    type: String,
  },
});

const Feedback = mongoose.model("feedback", feedbackSchema);
module.exports = Feedback;
