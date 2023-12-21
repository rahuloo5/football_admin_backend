const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
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

const admin = mongoose.model("admin", adminSchema);

module.exports = admin;
