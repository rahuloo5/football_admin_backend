const User = require("../../db/models/user.model");
const Plan = require("../../db/models/plan.model")
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const nodemailer = require("nodemailer");
const bcrypt = require('bcrypt')

const {
  GeneratesSignature,
} = require("../middleware/authorization.middleware");
const Subscription = require("../../db/models/plan_subscription.model");
const mongoose = require("mongoose");

// userSignup and userlogin functions have been moved to auth.controller.js

// Create a new user

const createuser = async (req, res) => {
  try {
    const { subscriptionId, number, firstName, lastName, email } = req.body;

    if (!mongoose.Types.ObjectId.isValid(subscriptionId)) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid subscription  ID" });
    }

    const Subscriptions = await Subscription.findById(subscriptionId);

    if (!Subscriptions) {
      return res
        .status(404)
        .json({ success: false, error: "Subscription not found" });
    }

    const newUser = new User({
      subscriptionId,
      number,
      firstName,
      lastName,
      email,
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: "user created successfully",
      newUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

const sentOTP = async(req,res)=>{
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: 'User not found' });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiry = Date.now() + 10 * 60 * 1000; // 10 min

  user.otp = otp;
  user.otpExpiry = expiry;
  await user.save();

  // send OTP via email (use nodemailer or service)
  const transporter = nodemailer.createTransport({
    service: 'gmail', // or your email provider
    auth: {
      user: process.env.NOTIFICATION_SENDER_EMAIL,
      pass: process.env.NOTIFICATION_SENDER_ID
    }
  });
  await transporter.sendMail({
    from: '"YourApp" <noreply@yourapp.com>',
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP is: ${otp}`
  })
  res.json({ message: 'OTP sent successfully' });
}

const resetPassword =async(req,res)=>{
  const { email, otp, newPassword, confirmPassword } = req.body;

  if (!email || !otp || !newPassword || !confirmPassword) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  if (user.otp !== otp || user.otpExpiry < Date.now()) {
    return res.status(400).json({ message: 'Invalid or expired OTP' });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  user.otp = null;
  user.otpExpiry = null;

  await user.save();

  res.json({ message: 'Password has been reset successfully' });
}

// Get all users

// const getAllUsers = async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 1;
//     const pageSize = parseInt(req.query.pageSize) || 10;
//     const { 
//       email = "", 
//       firstName = "", 
//       number = "",
//       _id = "", 
//     } = req?.query?.query || {};
//     const startDate = req.query?.query?.startDate;
//     const endDate = req.query?.query?.endDate;
//     const startIndex = (page - 1) * pageSize;

//     let query = {};
//     if (email) {
//       query.email = { $regex: email, $options: 'i' };
//     }
//     if (firstName) {
//       query.firstName = { $regex: firstName, $options: 'i' };
//     }
//     if (number) {
//       query.number = { $regex: number, $options: 'i' };
//     }

//     if (startDate && endDate) {
//       const range = { $gte: new Date(startDate), $lte: new Date(endDate) };
//       const matchingPlans = await Plan.find({ createdAt: range }).select("_id");
//       const planIds = matchingPlans.map(plan => plan._id);
//       if (planIds.length > 0) {
//         query.subscriptionId = { $in: planIds };
//         console.log("subscriptionId", query?.susbscriptionId)
//       }
//       console.log("matching plans:", matchingPlans);
//     }

//     let users = await User.find(query).populate({
//       path: "subscriptionId",
//       populate: { path: "subscription" },
//     });

//     if (_id) {
//       const regex = new RegExp(_id, 'i');
//       users = users.filter(user => regex.test(user._id.toString()));
//     }

//     // Pagination and sorting
//     const totalUsers = users.length;
//     const totalPages = Math.ceil(totalUsers / pageSize);
//     const paginatedUsers = users.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(startIndex, startIndex + pageSize);

//     const paginationInfo = {
//       currentPage: page,
//       totalPages: totalPages,
//       pageSize: pageSize,
//       totalUsers: totalUsers,
//     };

//     res.status(200).json({
//       success: true,
//       message: "Users retrieved successfully",
//       data: { users: paginatedUsers, paginationInfo }
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

const getAllUsers = async (req,res) =>{
  try {
    const users = await User.find({}, {
      firstname: 1,
      lastname: 1,
      email: 1,
      gender: 1,
      age: 1,
      level: 1,
      position: 1,
      subscriptionType: 1,
      subStatus: 1,
      height: 1,
      weight: 1,
      subscriptionExpiry: 1,
      address: 1,
      createdAt: 1,
      foot:1,
      idealPlayer:1,
      dob:1,
      number:1,
      address:1
    });
console.log(users,"users")
    // Optional: Combine first and last name
    const userData = users.map(user => ({
      id: user._id,
      name: `${user.firstname} ${user.lastname}`,
      email: user.email,
      gender: user.gender,
      age: user.age,
      level: user.level,
      position: user.position,
      subscriptionType: user.subscriptionType,
      subStatus: user.subStatus,
      height: user.height,
      weight: user.weight,
      expiry: user.subscriptionExpiry,
      address: user.address,
      createdAt: user.createdAt,
      foot:user.foot,
      idealPlayer:user.idealPlayer,
      dob:user.dob,
      number:user.number,
      address:user.address
    }));

    res.json(userData);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
}
// Get a specific user by ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params?.id).populate({
      path: "subscriptionId",
      populate: { path: "subscription" },
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a user by ID
const updateuser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a user by ID

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const existingUser = await User.findById(userId);

    if (!existingUser) {
      return res.status(404).json({ error: "User not found" });
    }
    await User.findByIdAndDelete(userId);

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// create user plan

const createUserplan = async (req, res) => {
  try {
    const { planId } = req?.params;

    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "Not authenticated user" });
    }

    const existingUserPlan = await User.findOne({ user: user._id });
    console.log(planId, "RMGGJRGJ");
    if (existingUserPlan) {
      const uplanUpdate = await User.findOneAndUpdate(
        { user: user._id },
        { planId: planId },
        { new: true }
      );
      const clientsecret = await createsub(uplanUpdate?._id);
      return res.status(200).json({
        message: "User plan updated",
        uplanUpdate,
        ...clientsecret,
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const createsub = async (userId) => {
  try {
    const user = await User.findById(userId).populate("planId");

    console.log("plan found:", user);

    // create customer

    const customer = await stripe.customers.create({
      name: "Jenny Rosen",
      address: {
        line1: "510 Townsend St",
        postal_code: "98140",
        city: "San Francisco",
        state: "CA",
        country: "US",
      },
    });

    console.log("Stripe Customer created:", customer);

    // create product

    const product = await stripe.products.create({
      name: "gold plan",
      type: "service",
    });

    //   console.log("Stripe Customer created:", product);

    //creating stripe prices
    const ephemeralKey = await stripe.ephemeralKeys.create(
      { customer: customer.id },
      { apiVersion: "2023-10-16" }
    );

    const price = await stripe.prices.create({
      currency: "usd",
      unit_amount: 2000,
      recurring: {
        interval: "month",
      },
      product: product?.id,
    });
    const subscription = await stripe.subscriptions.create({
      customer: customer?.id,
      items: [{ price: price.id }],
      payment_behavior: "default_incomplete",
      payment_settings: { save_default_payment_method: "on_subscription" },
      expand: ["latest_invoice.payment_intent"],
    });

    let pubkey = process.env.PUBLISHED_KEY;
    let respond = {
      client_secret: subscription.latest_invoice.payment_intent.client_secret,
      subscriptionId: subscription.id,
      ephemeralKey,
      pubkey,
    };
    //  console.log(respond, subscription);
    return respond;
  } catch (error) {
    console.log(error);
  }
};

//nodemail api

var transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "26bc6b986e7a40",
    pass: "9a1466e5e1e7ab",
  },
});

const sendNotification = async (req, res) => {
  const { to, subject, text } = req.body;

  const mailOptions = {
    from: "your_email@example.com",
    to,
    subject: "Invoice Payment Confirmation",
    text: `Thank you for your payment! Your invoice (#${invoiceNumber}) has been paid successfully.`,
  };

  transport.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).send(`Error sending email: ${error.message}`);
    }

    res.status(200).json({ message: "Email sent successfully", info });
  });
};

// transection api

const transactionapi = async (req, res) => {
  try {
    let user = req.user;

    const updatedUser = await User.findById(user?._id);

    let singlesub = await subscription
      .findOne({ userId: user?._id })
      .populate("userId")
      .populate("planId");

    const transactions = await stripe.paymentIntents.list({
      customer: updatedUser?.stripecustomer,
    });

    const payments = transactions.data.map((invoice) => ({
      plan: singlesub?.planId?.title || "Basic",
      amount: invoice.amount,
      timestamp: moment(invoice.created).format("L"),
      status: invoice.status,
    }));

    return res.json({
      message: "success",
      payments,
    });
  } catch (err) {
    console.log(err, "cheking erroe");
    return res.json({
      message: "invalid server error",
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const { email, oldPassword, newPassword, confirmPassword } = req.body;

    // Check if all fields are provided
    if (!email || !oldPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Check if new passwords match
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "New passwords do not match." });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Compare old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect." });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully." });
  } catch (error) {
    console.error("Change Password Error:", error);
    res.status(500).json({ message: "Server Error." });
  }
};

/**
 * Create or update user profile
 */
const createProfile = async (req, res) => {
  try {
    // Get user ID from auth middleware
    const userId = req.user.id;
    
    if (!userId) {
      return res.status(400).json({ 
        success: false, 
        error: "User ID not found in request" 
      });
    }

    // Find user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        error: "User not found" 
      });
    }

    // Check if user is verified
    if (!user.isActive) {
      return res.status(400).json({
        success: false,
        error: "User account is not verified. Please verify your email first."
      });
    }

    // Update user profile fields if provided
    const { firstname, lastname, gender, dob, level, position, foot, phone, address, idealPlayer, height, weight, description, age } = req.body;
    
    if (firstname) user.firstname = firstname;
    if (lastname) user.lastname = lastname;
    if (gender) user.gender = gender;
    if (dob) user.dob = dob;
    if (level) user.level = level;
    if (position) user.position = position;
    if (foot) user.foot = foot;
    if (phone) user.phone = phone;
    if (address) user.address = address;
    if (idealPlayer) user.idealPlayer = idealPlayer;
    if (height) user.height = height;
    if (weight) user.weight = weight;
    if (description) user.description = description;
    if (age) user.age = age;

    // Save updated user
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ 
      success: false, 
      error: "Internal Server Error" 
    });
  }
};

module.exports = {
  createsub,
  getAllUsers,
  createuser,
  deleteUser,
  updateuser,
  getUserById,
  createUserplan,
  transactionapi,
  changePassword,
  createProfile,
  sendNotification,
  sentOTP,
  resetPassword
  
};
