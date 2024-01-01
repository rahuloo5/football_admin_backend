const mongoose = require("mongoose");

const screenSchema = new mongoose.Schema({
  title: {
    type: String,
  },

  screen_image: {
    type: String,
  },
});

const Screen = mongoose.model("screen", screenSchema);
module.exports = Screen;
