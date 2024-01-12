const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  otp: {
    type: Number,
    require: true,
  },
  type: {
    type: String,
    enum: ["REGISTER", "FORGET"],
    default: "REGISTER",
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: "5m",
  },
});

exports.OTP = mongoose.model("Otp", otpSchema);
