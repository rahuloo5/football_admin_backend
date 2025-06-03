const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  options: {
    type: [String],
    validate: [arrayLimit, 'Options must have at least two choices.'],
  },
  correctAnswerIndex: {
    type: Number,
    required: true,
  }
});

function arrayLimit(val) {
  return val.length >= 2;
}

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  level: {
    type: String,
    required: true,
    // enum: ['beginner', 'intermediate', 'advanced']
  },
  ageGroup: {
    type: String,
    required: true,
    // enum: ['u12', 'u15', 'u18', 'adult']
  },
  position: {
    type: String,
    required: true,
    // enum: ['goalkeeper', 'defender', 'midfielder', 'forward']
  },
  questions: {
    type: [questionSchema],
    required: true,
    // validate: [arrayLimit, 'Quiz must have at least one question.']
  }
});

const Quiz = mongoose.model("Quiz", quizSchema);

module.exports = Quiz;

