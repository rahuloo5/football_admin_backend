const mongoose = require("mongoose");

const deviceSchema = new mongoose.Schema(
  {
    device_name: {
      type: String,
    },
    device_terms: {
      type: String,
    },
    overall_security: { type: String },
    overall_privacy: { type: String },
    Icons: [{ type: String }],
    Images: [{ type: String }],
    security_tips: { type: String },
    product_purchase_info: {
      type: String,
    },
    device_policies: [{ type: String }],
    video_urls: [{ type: String, unique: true }],
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },

    Recommended_Product: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const manageDevice = mongoose.model("manageDevice", deviceSchema);
module.exports = manageDevice;
