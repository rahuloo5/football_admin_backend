const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
    },
    number: {
      type: Number,
      required: true,
    },
    countryCode: {
      type: String,
    },
    country: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// // Combine countrycode and number to form the phone_number
// userSchema.pre("save", function (next) {
//   if (this.countrycode && this.phone_number) {
//     this.phone_number = `${this.countrycode}${this.phone_number}`;
//   }
//   next();
// });

const User = mongoose.model("User", userSchema);
module.exports = User;
