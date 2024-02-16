const mongoose = require("mongoose");

const planSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },

    text_message_count: {
      type: Number,
      required: true,
    },

    video_message_count: {
      type: Number,
      required: true,
    },
    audio_message_count: {
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
    active_plan: {
      type: Boolean,
    },
  },

  { timestamps: true }
);

const Plan = mongoose.model("Plan", planSchema);

module.exports = Plan;
