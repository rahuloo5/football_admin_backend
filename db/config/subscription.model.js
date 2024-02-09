const mongoose = require("mongoose");

const SubscriptionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },

    text_message_count: {
      type: Number,
      required: true,
    },

    Subscription: {
      type: String,
      enum: ["monthly", "annually", "Both"],
      required: true,
    },

    amount: {
      type: Number,
      default: 0,
      required: true,
    },

    description: {
      type: String,
    },
  },

  { timestamps: true }
);

const Subscription = mongoose.model("Subscription", SubscriptionSchema);

module.exports = Subscription;
