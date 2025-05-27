const mongoose = require("mongoose");

// Chapter schema - for individual modules within a course
const chapterSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    order: {
      type: Number,
      required: true
    },
    duration: {
      type: Number, // Duration in seconds
      default: 0
    },
    filePath: {
      type: String,
      required: true
    },
    dataType: {
      type: String,
      enum: ["pdf", "video"],
      required: true
    }
  },
  { _id: true }
);

// Main course schema
const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ["training", "nutrition"],
      required: true
    },
    subtype: {
      type: String,
      required: true
    },
    ageGroup: {
      type: String,
      required: true
    },
    level: {
      type: String,
      required: true
    },
    position: {
      type: String,
      required: true
    },
    thumbnail: {
      type: String,
      default: ""
    },
    chapters: {
      type: [chapterSchema],
      default: []
    },
    isActive: {
      type: Boolean,
      default: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  {
    timestamps: true // Adds createdAt and updatedAt automatically
  }
);

module.exports = mongoose.model("Course", courseSchema);
