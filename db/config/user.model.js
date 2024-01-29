const mongoose = require("mongoose");

// const userSchema = new mongoose.Schema(
//   {
//     firstName: {
//       type: String,
//     },

//     lastName: {
//       type: String,
//     },
//     email: {
//       type: String,
//       required: true,
//     },
//     number: {
//       type: Number,
//       required: true,
//     },
//     countryCode: {
//       type: String,
//     },
//     country: {
//       type: String,
//     },
//     isVerified: {
//       type: Boolean,
//       default: false,
//     },
//     isOnboardingDone: {
//       type: Boolean,
//       default: false,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// const User = mongoose.model("User", userSchema);
// module.exports = User;

const userSchema = new mongoose.Schema({
  number: {
    type: String,
    required: true,
    unique: true,
  },
  otp: {
    type: String,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
