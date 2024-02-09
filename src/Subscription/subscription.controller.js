const Stripe = require("stripe");
const Subscription = require("../../db/config/subscription.model");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Create Plan
const createPlan = async (req, res) => {
  try {
    const product = await stripe.products.create({
      name: req.body.title,
    });

    const plan = await stripe.plans.create({
      amount: req.body.amount * 100,
      currency: "usd",
      interval: "month",
      product: product.id,
    });

    const newPlan = new Subscription(req.body);

    newPlan.stripeplan = plan.id;

    const savedPlan = await newPlan.save();
    if (savedPlan) {
      console.log(savedPlan);
      return res.json({
        message: "plan will be created",
        savedPlan,
      });
    }
    return res.status(500).json({ message: "Internal server error" });
  } catch (error) {
    console.error("Error in createPlan:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Get all Plans

const getAllPlans = async (req, res) => {
  try {
    const allPlans = await Subscription.find();
    return res.json({ plans: allPlans });
  } catch (error) {
    console.error("Error in getAllPlans:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getPlanById = async (req, res) => {
  try {
    const plan = await Subscription.findById(req.params.id);
    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }
    return res.json({ plan });
  } catch (error) {
    console.error("Error in getPlanById:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Update Plan by ID

const updatePlanById = async (req, res) => {
  try {
    const updatedPlan = await Subscription.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedPlan) {
      return res.status(404).json({ message: "Plan not found" });
    }
    return res.json({
      message: "Plan updated successfully",
      updatedPlan,
    });
  } catch (error) {
    console.error("Error in updatePlanById:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Delete Plan by ID

const deletePlanById = async (req, res) => {
  try {
    const deletedPlan = await Subscription.findByIdAndDelete(req.params.id);
    if (!deletedPlan) {
      return res.status(404).json({ message: "Plan not found" });
    }
    return res.json({
      message: "Plan deleted successfully",
      deletedPlan,
    });
  } catch (error) {
    console.error("Error in deletePlanById:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
const activeplan = async (req, res) => {
  const { id } = req.params;

  try {
    const plan = await Plans.findById(id);

    if (!plan) {
      return res.status(404).json({ error: "Plan not found" });
    }

    plan.active_plan = !plan.active_plan;
    await plan.save();

    res.json({ message: "Plan status toggled successfully", plan });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createPlan,
  getAllPlans,
  getPlanById,
  updatePlanById,
  deletePlanById,
  activeplan,
};
