const mongoose = require("mongoose");

const contactUsSchema = new mongoose.Schema({
  subject: {
    type: String,
  },
  comment: {
    type: String,
  },
});

const ContactUs = mongoose.model("ContactUs", contactUsSchema);
module.exports = ContactUs;
