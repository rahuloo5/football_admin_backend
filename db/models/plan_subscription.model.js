const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema(
  {
    planName: {
      type: String,
      required: true,
    },
    numberOfSearchAllowed: {
      type: Number,
      
    },
    planSubscription: {
      type: String,
      required: true,
    },
    planAmount: {
      type: Number,
      required: true,
    },
    planDescription: {
      type: String,
    },
    productId: {
      type: String,
    },
    deviceType: {
      type: String,
    },
  },
  { timestamps: true }
);

const Subscription = mongoose.model("Subscription", subscriptionSchema);

module.exports = Subscription;
