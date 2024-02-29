const Notification = require("../../db/config/notification.model");
const Subscription = require("../../db/config/plan_subscription.model");
const { subscriptionValidationSchema } = require("./plan_subscription.dto");

// Create
const addsubscription = async (req, res) => {
  try {
    // Validate the request body against the Joi schema
    const { error } = subscriptionValidationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const {
      planName,
      numberOfSearchAllowed,
      planSubscription,
      planAmount,
      planDescription,
    } = req.body;

    const newSubscription = new Subscription({
      planName,
      numberOfSearchAllowed,
      planSubscription,
      planAmount,
      planDescription,
    });

    await newSubscription.save();

    res.status(201).json(newSubscription);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Read (Get all subscriptions)
const getAllsubscription = async (req, res) => {
  try {
    const subscriptions = await Subscription.find();
    res.json(subscriptions);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Read (Get a specific subscription by ID)
const getsubscriptionbyId = async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.params.id);
    res.json(subscription);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update
const updatesubscription = async (req, res) => {
  try {
    // Validate the request body against the Joi schema
    const { error } = subscriptionValidationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const {
      planName,
      numberOfSearchAllowed,
      planSubscription,
      planAmount,
      planDescription,
    } = req.body;
    const updatedSubscription = await Subscription.findByIdAndUpdate(
      req.params.id,
      {
        planName,
        numberOfSearchAllowed,
        planSubscription,
        planAmount,
        planDescription,
      },
      { new: true }
    );
    res.json(updatedSubscription);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Delete
const deletesubscription = async (req, res) => {
  try {
    const deletedSubscription = await Subscription.findByIdAndDelete(
      req.params.id
    );
    res.json(deletedSubscription);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//fake notification

const notification = async (req, res) => {
  try {
    const { title } = req.body;
    const newNotification = new Notification({ title });
    const savedNotification = await newNotification.save();
    res.json(savedNotification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Read (Get all notifications)
const allnotification = async (req, res) => {
  try {
    const notifications = await Notification.find();
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  deletesubscription,
  addsubscription,
  updatesubscription,
  getsubscriptionbyId,
  getAllsubscription,

  //fake notification
  notification,
  allnotification,
};
