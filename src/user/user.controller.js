const User = require("../../db/config/user.model");
const Plan = require("../../db/config/plan.model")
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const nodemailer = require("nodemailer");

const {
  GeneratesSignature,
} = require("../middleware/authorization.middleware");
const Subscription = require("../../db/config/plan_subscription.model");
const mongoose = require("mongoose");

const userSignup = async (req, resp) => {
  try {
    const { firstName, lastName, email, number, password } = req.body;
    console.log(req.body, "checking body is here");
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return resp
        .status(400)
        .json({ message: "User with this email already exists" });
    }

    // Create a new user
    const newUser = new User({
      firstName,
      lastName,
      email,
      number,
      password,
    });

    // Save the user to the database
    await newUser.save();

    resp.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    resp.status(500).json({ message: "Internal server error" });
  }
};

const userlogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log(req.body, "checking login here only");

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (user.password === password) {
      let signature = await GeneratesSignature({
        _id: user._id,
        email: user.email,
      });

      return res.status(200).json({
        token: signature,
      });
    }

    return res.status(401).json({
      message: "Invalid credentials",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

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

// Get all users

const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const { 
      email = "", 
      firstName = "", 
      number = "",
      _id = "", 
    } = req?.query?.query || {};
    const startDate = req.query?.query?.startDate;
    const endDate = req.query?.query?.endDate;
    const startIndex = (page - 1) * pageSize;

    let query = {};
    if (email) {
      query.email = { $regex: email, $options: 'i' };
    }
    if (firstName) {
      query.firstName = { $regex: firstName, $options: 'i' };
    }
    if (number) {
      query.number = { $regex: number, $options: 'i' };
    }

    if (startDate && endDate) {
      const range = { $gte: new Date(startDate), $lte: new Date(endDate) };
      const matchingPlans = await Plan.find({ createdAt: range }).select("_id");
      const planIds = matchingPlans.map(plan => plan._id);
      if (planIds.length > 0) {
        query.subscriptionId = { $in: planIds };
        console.log("subscriptionId", query?.susbscriptionId)
      }
      console.log("matching plans:", matchingPlans);
    }

    let users = await User.find(query).populate({
      path: "subscriptionId",
      populate: { path: "subscription" },
    });

    if (_id) {
      const regex = new RegExp(_id, 'i');
      users = users.filter(user => regex.test(user._id.toString()));
    }

    // Pagination and sorting
    const totalUsers = users.length;
    const totalPages = Math.ceil(totalUsers / pageSize);
    const paginatedUsers = users.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(startIndex, startIndex + pageSize);

    const paginationInfo = {
      currentPage: page,
      totalPages: totalPages,
      pageSize: pageSize,
      totalUsers: totalUsers,
    };

    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: { users: paginatedUsers, paginationInfo }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


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
    console.log(existingUserPlan, "fjjfj");
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

module.exports = {
  createsub,
  userSignup,
  userlogin,
  getAllUsers,
  createuser,
  deleteUser,
  updateuser,
  getUserById,
  createUserplan,
  transactionapi,

  //mailtrap
  sendNotification,
};
