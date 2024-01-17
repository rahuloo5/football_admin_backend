const mongoose = require("mongoose");

const SubscriptionSchema = new mongoose.Schema(
  {
    plan_name: {
      type: String,
    },

    number_search: {
      type: Number,
    },

    Plan_Subscription: {
      type: Number,
    },

    Plan_Subscription: {
      type: String,
      enum: ["monthly", "annually", "Both"],
      required: true,
    },

    startDate: {
      type: Date,
      default: Date.now(),
    },
    renewDate: {
      type: Date,
    },
    amount: {
      type: Number,
      required: true,
    },

    plan_description: {
      type: Number,
    },
  },

  { timestamps: true }
);

const Subscription = mongoose.model("Subscription", SubscriptionSchema);

module.exports = Subscription;
