const User = require("../../db/config/user.model");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Plan = require("../../db/config/plan.model");

const {
  GeneratesSignature,
} = require("../middleware/authorization.middleware");
const { log } = require("handlebars");

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
    const newUser = new User(req.body);

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a specific user by ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
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
// const createUserplan = async (req, res) => {
//   try {
//     const { planId } = req.body;

//     if (!user) {
//       return res.status(401).json({ message: "Not authenticated user" });
//     }

//     const existingUserPlan = await User.findOne({ id });

//     if (existingUserPlan) {
//       const uplanUpdate = await User.findOneAndUpdate(
//         { user: user._id },
//         { plan: planId },
//         { new: true }
//       );

//       return res.status(200).json({
//         message: "User plan updated",
//         uplanUpdate,
//         ...clientsecret,
//       });
//     }

//     const uplan = await User.create({
//       user: user._id,
//       plan: planId,
//     });

//     clientsecret = await createsub(user, planId);

//     return res.status(200).json({
//       message: "User plan created",
//       uplan,
//       ...clientsecret,
//     });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ message: "Internal Server Error" });
//   }
// };

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
      phone: user?.number,
    });

    console.log("Stripe Customer created:", customer);

    // create product

    const product = await stripe.products.create({
      name: "gold plan",
      type: "service",
    });

    console.log("Stripe Customer created:", product);

    //creating stripe prices
    const ephemeralKey = await stripe.ephemeralKeys.create(
      { customer: customer.id },
      { apiVersion: "2023-10-16" }
    );

    const price = await stripe.prices.create({
      currency: "usd",
      unit_amount: 20,
      recurring: {
        interval: "month",
      },
      product: product?.id,
    });
    const subscription = await stripe.subscriptions.create({
      customer: customer?.id,
      items: [{ price: price.id }],
      payment_behavior: "default_incomplete",
      expand: ["latest_invoice.payment_intent"],
    });
    let pubkey = process.env.PUBLISHED_KEY;
    let respond = {
      client_secret: subscription.latest_invoice.payment_intent.client_secret,
      subscriptionId: subscription.id,
      ephemeralKey,
      pubkey,
    };
    console.log(respond);
    return respond;
  } catch (error) {
    console.log(error);
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
};
