const mongoose = require("mongoose");

const planSchema = new mongoose.Schema(
  {
    subscription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subscription",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    active_plan: {
      type: Boolean,
    },
    start_date: {
      type: Date,
    },
    end_date: {
      type: Date,
    },
    transactionId: {
      type: String,
    },
    transactionReceipt: {
      type: String,
    },
  },
  { timestamps: true }
);

const Plan = mongoose.model("Plan", planSchema);

module.exports = Plan;
