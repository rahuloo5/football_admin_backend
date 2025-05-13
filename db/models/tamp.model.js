const mongoose = require("mongoose");

const tempOTPSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  otp: {
    type: Number,
    required: true,
  },
});

const TempOTP = mongoose.model("TempOTP", tempOTPSchema);

module.exports = TempOTP;
