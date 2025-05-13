// const mongoose = require("mongoose");

// const Mongoose = require("mongoose");
// const localDB = `mongodb+srv://devops:TtHCNevgeWAOghBE@cluster0.m8pee.mongodb.net/secureyourliving_dev`;
// const connectDB = async () => {
//   await Mongoose.connect(localDB);
//   console.log("MongoDB Connected");
// };
// module.exports = connectDB;

const mongoose = require("mongoose");
require("dotenv").config();
const MONGODB_URI = process.env.MONGO;

exports.connect = () => {
  mongoose
    .connect(MONGODB_URI,{
            dbName:'football',
              bufferCommands:true,
            useNewUrlParser: true,
      })
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB connection error:", err.message));
};
