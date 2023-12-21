const mongoose = require("mongoose");

const Mongoose = require("mongoose");
const localDB = `mongodb://localhost:27017/secure-living`;
const connectDB = async () => {
  await Mongoose.connect(localDB);
  console.log("MongoDB Connected");
};
module.exports = connectDB;
