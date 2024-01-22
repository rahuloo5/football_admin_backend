const mongoose = require("mongoose");
const Subscription = require("../../db/config/subscription.model");

// Create a new subscription
// const createsubscription = async (req, res) => {
//   try {
//     const subscription = new Subscription(req.body);
//     console.log("subscription plan ", req.body);
//     await subscription.save();
//     res.status(201).json(subscription);
//   } catch (error) {
//     console.error("Error creating subscription:", error);
//     res
//       .status(500)
//       .json({ error: "Internal Server Error", details: error.message });
//   }
// };

const createsubscription = async (req, res) => {
  try {
    const subscriptions = await Subscription.find().populate("User");
    res.json(subscriptions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Get all subscriptions

const getAllSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find().populate("userId");

    res.status(200).json(subscriptions);
  } catch (error) {
    console.error("Error retrieving subscriptions:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
};

// Get a subscription by ID
const getsubscriptionById = async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.params.id);
    if (!subscription) {
      return res.status(404).json({ error: "Subscription not found" });
    }
    res.json(subscription);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update a subscription by ID
const updateSubscription = async (req, res) => {
  try {
    const updatedSubscription = await Subscription.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    console.log("sdfghjkasdfg", req.body);
    if (!updatedSubscription) {
      return res.status(404).json({ error: "Subscription not found" });
    }
    res.json(updatedSubscription);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Delete a subscription by ID

const deleteSubscription = async (req, res) => {
  try {
    const subscriptionId = req.params.id;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(subscriptionId)) {
      return res.status(400).json({ error: "Invalid Subscription ID format" });
    }

    const deletedSubscription = await Subscription.findByIdAndDelete(
      subscriptionId
    );

    if (!deletedSubscription) {
      console.log(`Subscription with ID ${subscriptionId} not found`);
      return res.status(404).json({ error: "Subscription not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Subscription deleted successfully" });
  } catch (error) {
    console.error("Error deleting subscription:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
};

module.exports = {
  createsubscription,
  getAllSubscriptions,
  getsubscriptionById,
  updateSubscription,
  deleteSubscription,
};
