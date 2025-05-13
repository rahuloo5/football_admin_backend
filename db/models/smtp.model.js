const mongoose = require("mongoose");

const smtpschema = new mongoose.Schema({
  slug: {
    type: String,
  },
  host: {
    type: String,
  },
  port: {
    type: String,
  },
  user: {
    type: String,
  },
  password: {
    type: String,
  },
});

const Smtp = mongoose.model("Smtp", smtpschema);

module.exports = Smtp;
