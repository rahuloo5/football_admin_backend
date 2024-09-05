const mongoose = require("mongoose");

const termsSchema = new mongoose.Schema({
  content: {
    type: String,
  },
});

const Terms = mongoose.model("TermsCondition", termsSchema);
module.exports = Terms;
