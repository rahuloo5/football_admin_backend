const mongoose = require("mongoose");

const privacySchema = new mongoose.Schema({
  content: {
    type: String,
  },
});

const PrivacyPolicy = mongoose.model("PrivacyPolicy", privacySchema);
module.exports = PrivacyPolicy;
