const mongoose = require("mongoose");

const paymentschema = new mongoose.Schema(
  {
    paymentDate: {
      type: Date,
      required: true,
      default: Date.now(),
    },
    renewalDate: {
      type: Date,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    planId: {
      type: Schema.Types.ObjectId,
      ref: "Plan",
    },

    UserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    sessionId: {
      type: String,
    },
    status: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Payment = mongoose.model("Payment", paymentschema);

module.exports = Payment;
