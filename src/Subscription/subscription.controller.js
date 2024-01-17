const mongoose = require("mongoose");
const Subscription = require("../../db/config/subscription.model");

// Create a new subscription
const createsubscription = async (req, res) => {
  try {
    const newSubscription = new Subscription(req.body);
    const savedSubscription = await newSubscription.save();
    res.status(201).json(savedSubscription);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get all subscriptions
const getAllsubscription = async (req, res) => {
  try {
    const subscriptions = await Subscription.find();
    res.json(subscriptions);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
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
    const deletedSubscription = await Subscription.findByIdAndRemove(
      req.params.id
    );
    if (!deletedSubscription) {
      return res.status(404).json({ error: "Subscription not found" });
    }
    res.json(deletedSubscription);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  createsubscription,
  getAllsubscription,
  getsubscriptionById,
  updateSubscription,
  deleteSubscription,
};
