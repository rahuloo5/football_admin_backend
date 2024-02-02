const mongoose = require("mongoose");

// const deviceSchema = new mongoose.Schema(
//   {
//     device_name: {
//       type: String,
//       // required: true,
//     },
//     description: {
//       type: String,
//       // required: true,
//     },
//     deviceImages: [
//       {
//         type: String,
//       },
//     ],
//     deviceIcons: [
//       {
//         type: String,
//       },
//     ],

//     video_url: {
//       type: [
//         {
//           type: String,
//           required: "URL can't be empty",
//           unique: true,
//         },
//       ],
//     },
//     policy_url: {
//       type: [
//         {
//           type: String,
//           required: "URL can't be empty",
//           unique: true,
//         },
//       ],
//     },
//     categorie: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Subcategory",
//       // required: true,
//     },

//     categorie: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Category",
//       // required: true,
//     },
//     secuirty_overview: String,
//     privacy_overview: String,
//     other_information: String,
//   },
//   { timestamps: true }
// );
// const mongoose = require("mongoose");

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
    video_url1: {
      type: [
        {
          type: String,
          // required: true, // Corrected to boolean value
          // unique: true,
        },
      ],
    },
    policy_url1: {
      type: [
        {
          type: String,
          // required: true, // Corrected to boolean value
          // unique: true,
        },
      ],
    },
    video_url: {
      type: [
        {
          type: String,
          required: true,
          unique: true,
        },
      ],
    },
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
  },

  { timestamps: true }
);

const Device = mongoose.model("Device", deviceSchema);
module.exports = Device;

// const Device = mongoose.model("Device", deviceSchema);
// module.exports = Device;
