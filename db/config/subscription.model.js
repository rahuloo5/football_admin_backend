const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  planId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Plans",
    required: true,
  },
  status: {
    type: String,
    enum: ["active", "canceled", "past_due", "incomplete", "unpaid", "paid"],
    default: "active",
  },
  stripeSubscriptionId: {
    type: String,
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
  text_message_count: {
    type: Number,
    default: 0,
  },
});
const subscription = mongoose.model("subscription", subscriptionSchema);

module.exports = subscription;
