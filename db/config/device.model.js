const mongoose = require("mongoose");

const deviceSchema = new mongoose.Schema(
  {
    device_name: {
      type: String,
    },
    Images: [
      {
        type: String,
      },
    ],
    video_url: [
      {
        type: String,
      },
    ],
    policy_url: [
      {
        type: String,
      },
    ],

    categorie: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },

    sub_categorie: { type: mongoose.Schema.Types.ObjectId, ref: "Subcategory" },

    secuirty_overview: {
      type: String,
    },
    privacy_overview: {
      type: String,
    },
    other_information: {
      type: String,
    },
  },

  { timestamps: true }
);

const Device = mongoose.model("Device", deviceSchema);

module.exports = Device;
