// const mongoose = require("mongoose");

// const userSchema = new mongoose.Schema({
//   number: {
//     type: String,
//     required: true,
//     unique: true,
//   },
//   firstName: {
//     type: String,
//   },

//   lastName: {
//     type: String,
//   },
//   email: {
//     type: String,
//   },

//   subscriptionId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Subscription",
//   },

//   isActive: { type: Boolean, default: false },

//   otp: {
//     type: String,
//   },

//   password: {
//     type: String,
//   },

//   fcm_token: {
//     type: String,
//     // required: true,
//   },

//   role: {
//     type: [String],
//     enum: ["Admin", "User"],
//     default: ["User"],
//   },
// });

// const User = mongoose.model("User", userSchema);

// module.exports = User;

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  number: {
    type: String,
  
    unique: true,
  },
  firstname: {
    type: String,
  },
  lastname: {
    type: String,
  },
  email: {
    type: String,
  },
  subscriptionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Plan",
  },
  isActive: { type: Boolean, default: false },
  otp: {
    type: String,
  },
  password: {
    type: String,
  },
  fcm_token: {
    type: String,
  },
  role: {
    type: [String],
    enum: ["Admin", "User"],
    default: ["User"],
  },
   gender: { type: String,
    //  enum: ["Male", "Female", "Other"] 
    },
  dob: {
    type: String,
    
  },
 address:{
  type:String
 },
  level: {
    type: String,
    // enum: ['Beginner', 'Intermediate', 'Advanced', 'Professional'],
    
  },
  position: {
    type: String,
    // enum: ['Forward', 'Midfielder', 'Defender', 'Goalkeeper'],
   
  },
  foot: {
    type: String,
    // enum: ['Right', 'Left', 'Both'],
  
  },
  subscriptionType: {
    type: String,
    // enum: ['Free', 'Monthly', 'Annually'],
   
  },
  height: {
    type: Number, // in cm
   
  },
  weight: {
    type: Number, // in kg
   
  },
  idealPlayer: {
    type: String,
   
  },
  subStatus: {
    type: String,
    // enum: ['Pending', 'Approved', 'Rejected'],
    // default: 'Pending',
  },
  subscriptionExpiry: {
    type: Date
  },
  description:{
    type:String,
  },
  age:{
    type:Number,
  },
  requestStatus:{
    type:String
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
