const mongoose = require("mongoose");

const privacyOverviewSchema = new mongoose.Schema({
  title1: String,
  description1: String,
});
const secuirtyOverviewSchema = new mongoose.Schema({
  title2: String,
  description2: String,
});

const otherOverviewSchema = new mongoose.Schema({
  title3: String,
  description3: String,
});

const condition = new mongoose.Schema({
  title4: String,
  description4: String,
});

const deviceSchema = new mongoose.Schema(
  {
    device_name: {
      type: String,
      // required: true,
    },
    description: {
      type: String,
      // required: true,
    },
    deviceImages: [
      {
        type: String,
      },
    ],
    deviceIcons: [
      {
        type: String,
      },
    ],
    // video_url1: {
    //   type: [
    //     {
    //       type: String,
    //       required: true,
    //       unique: true,
    //     },
    //   ],
    // },
    policy_url1: {
      type: [
        {
          type: String,
          required: true,
          unique: true,
        },
      ],
    },
    // video_url: {
    //   type: [
    //     {
    //       type: String,
    //       required: true,
    //       unique: true,
    //     },
    //   ],
    // },

    // video_url: { type: String, default: "default_value" },

    policy_url: {
      type: [
        {
          type: String,
          required: true,
          unique: true,
        },
      ],
    },
    categorie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    privacy_overview: privacyOverviewSchema,
    secuirty_overview: secuirtyOverviewSchema,
    other_information: otherOverviewSchema,
    terms_conditions: condition,

    recommendedProduct: {
      type: Boolean,
      default: false,
    },
  },

  { timestamps: true }
);

const Device = mongoose.model("Device", deviceSchema);
module.exports = Device;
