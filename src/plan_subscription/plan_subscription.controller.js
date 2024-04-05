const Notification = require("../../db/config/notification.model");
const Subscription = require("../../db/config/plan_subscription.model");
const User = require("../../db/config/user.model");
const { subscriptionValidationSchema } = require("./plan_subscription.dto");

// Create
const addsubscription = async (req, res) => {
  try {
    // const { error } = subscriptionValidationSchema.validate(req.body);
    // if (error) {
    //   return res.status(400).json({ error: error.details[0].message });
    // }
    const {
      planName,
      numberOfSearchAllowed,
      planSubscription,
      planAmount,
      planDescription,
      productId,
      deviceType,
    } = req.body;

    const newSubscription = new Subscription({
      planName,
      numberOfSearchAllowed,
      planSubscription,
      planAmount,
      planDescription,
      productId,
      deviceType,
    });
    await newSubscription.save();
    res.status(201).json(newSubscription);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAllsubscription = async (req, res) => {
  try {
    const filter = {};
    if (req.query.type) {
      filter.deviceType = req.query.type;
    }
    const subscriptions = await Subscription.find(filter);
    let totalAmount = 0;
    let totalSubscriptions = subscriptions.length;

    subscriptions.forEach((subscription) => {
      totalAmount += subscription.planAmount;
    });

    const allPlans = {
      totalAmount,
      totalSubscriptions,
      subscriptions,
    };

    res.json({ plans: allPlans });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

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
    // const { error } = subscriptionValidationSchema.validate(req.body);
    // if (error) {
    //   return res.status(400).json({ error: error.details[0].message });
    // }

    const {
      planName,
      numberOfSearchAllowed,
      planSubscription,
      planAmount,
      planDescription,
      productId,
      deviceType,
    } = req.body;

    console.log(req.body);
    const updatedSubscription = await Subscription.findByIdAndUpdate(
      req.params.id,
      {
        planName,
        numberOfSearchAllowed,
        planSubscription,
        planAmount,
        planDescription,
        productId,
        deviceType,
      },
      { new: true }
    );
    res.json(updatedSubscription);
  } catch (error) {
    console.log(error);
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

const getTotalAmount = async (req, res) => {
  try {
    const subscriptions = await User.find({
      subscriptionId: { $ne: null },
    }).populate({ path: "subscriptionId", populate: "subscription" });
    // console.log(JSON.stringify(subscriptions));
    let totalAmount = 0;
    let totalSubscriptions = subscriptions.length;
    subscriptions.forEach((subscription) => {
      if (subscription.subscriptionId.subscription) {
        console.log(subscription.subscriptionId.subscription.planAmount);
        totalAmount += subscription.subscriptionId.subscription.planAmount;
      }
    });

    const result = {
      totalAmount,
      totalSubscriptions,
    };

    res.json(result);
  } catch (error) {
    console.log(error);
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

  // get total amount

  getTotalAmount,

  notification,
  allnotification,
};
