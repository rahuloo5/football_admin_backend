const mongoose = require("mongoose");

const deviceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    description: {
      type: String,
    },
  },

  { timestamps: true }
);

const Device = mongoose.model("device", deviceSchema);

module.exports = Device;
