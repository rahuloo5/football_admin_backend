const mongoose = require("mongoose");

// Define the schema
const yourSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  count: {
    type: Number,
    default: 0,
  },
});

// // Middleware to increment the count before saving
// yourSchema.pre("save", function (next) {
//   this.count += 1;
//   next();
// });

const YourModel = mongoose.model("YourModel", yourSchema);

module.exports = YourModel;
