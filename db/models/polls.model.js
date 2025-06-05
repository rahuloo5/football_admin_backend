const mongoose = require("mongoose");

const optionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  votes: {
    type: Number,
    default: 0,
  }
});

const pollSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  options: {
    type: [optionSchema],
    // validate: {
    //     validator: function (val) {
    //       return val.length >= 2;
    //     },
    //     message: 'A poll must have at least two options.'
    //   }
  }
});



const pollGroupSchema = new mongoose.Schema({
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
  },
  ageGroup: {
    type: String,
    required: true,
  },
  position: {
    type: String,
    required: true,
  },
  polls: {
    type: [pollSchema],
    // validate: {
    //     validator: function (val) {
    //       return val.length >0;
    //     },
    //     message: 'There must be at least one poll in the group.'
    //   },
  }
});

function pollGroupLimit(val) {
  return val.length >= 1;
}

const PollGroup = mongoose.model("PollGroup", pollGroupSchema);

module.exports = PollGroup;
