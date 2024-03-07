const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema(
  {
    planName: {
      type: String,
      required: true,
    },
    numberOfSearchAllowed: {
      type: Number,
      required: true,
    },
    planSubscription: {
      type: String,
      enum: ["monthly", "annually", "both"],
      required: true,
    },
    planAmount: {
      type: Number,
      required: true,
    },
    planDescription: {
      type: String,
    },
  },
  { timestamps: true }
);

const Subscription = mongoose.model("Subscription", subscriptionSchema);

module.exports = Subscription;
