const mongoose = require("mongoose");
const User = require("./user.model");

const requestSchema = new mongoose.Schema(
  {
   
    description: {
      type: String,
      default: "",
    },
   
    user:{
type:mongoose.Schema.Types.ObjectId,
ref:User,
    },
    date: {
        type: Date,
      },
  },
  {
    timestamps: true, 
  }
);

module.exports = mongoose.model("Community", requestSchema);
