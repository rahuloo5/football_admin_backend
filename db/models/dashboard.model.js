const { string } = require("joi");
const mongoose = require("mongoose");

const dashboardSchema = new mongoose.Schema({
  subscription: {
    type: String,
  },

  email: {
    type: String,
  },

  password: {
    type: String,
  },
});
const DashBoard = mongoose.model("User", dashboardSchema);
module.exports = DashBoard;
