const mongoose = require("mongoose");

const settingSchema = new mongoose.Schema(
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

const Setting = mongoose.model("setting", settingSchema);

module.exports = Setting;
