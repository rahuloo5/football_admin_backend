const mongoose = require("mongoose");

const userschema = new mongoose.Schema(
  {
    firstName: {
      type: String,
    },

    lastName: {
      type: String,
    },
    email_id: {
      type: String,
    },

    phone_number: {
      type: Number,
    },

    payment_plan: {
      type: String,
    },

    reg_date: {
      type: String,
      default: Date.now(),
    },

    otp: {
      type: String,
    },
    otp_created_at: {
      type: Date,
    },
    password: {
      type: String,
    },

    role: {
      type: [String],
      enum: ["Admin", "User"],
      default: ["User"],
    },
    token: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userschema);
module.exports = User;
