const mongoose = require("mongoose");

// Connect to your MongoDB database
mongoose.connect("mongodb://localhost/your_database_name", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define the schema
const yourSchema = new mongoose.Schema({
  searchText: {
    type: String,
    required: true,
  },
  count: {
    type: Number,
    default: 0,
  },
});

// Middleware to increment the count before saving
yourSchema.pre("save", function (next) {
  this.count += 1;
  next();
});

// Create the model
const YourModel = mongoose.model("YourModel", yourSchema);

module.exports = YourModel;
