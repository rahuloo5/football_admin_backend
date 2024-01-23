const mongoose = require("mongoose");

const deviceSchema = new mongoose.Schema(
  {
    device_name: String,
    Images: [String],
    Icons: [String],
    video_url: [String],
    policy_url: [String],
    categorie: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    sub_categorie: { type: mongoose.Schema.Types.ObjectId, ref: "Subcategory" },
    secuirty_overview: String,
    privacy_overview: String,
    other_information: String,
  },
  { timestamps: true }
);

const Device = mongoose.model("Device", deviceSchema);
module.exports = Device;
