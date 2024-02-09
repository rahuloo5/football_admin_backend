const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  number: {
    type: String,
    required: true,
    unique: true,
  },
  firstName: {
    type: String,
  },

  lastName: {
    type: String,
  },
  email: {
    type: String,
  },

  isActive: { type: Boolean, default: false },

  otp: {
    type: String,
  },

  password: {
    type: String,
  },

  role: {
    type: [String],
    enum: ["Admin", "User"],
    default: ["User"],
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
