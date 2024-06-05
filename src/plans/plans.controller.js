const Stripe = require("stripe");
const Plan = require("../../db/config/plan.model");
const moment = require("moment");
const User = require("../../db/config/user.model");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Create Plan

const createPlan = async (req, res) => {
  try {
    const { subscriptionId, transactionId, transactionReceipt } = req.body;

    const data = {
      subscription: subscriptionId,
      user: req.user,
      start_date: moment(),
      end_date: moment().add(30, "days"),
      transactionId: transactionId,
      transactionReceipt: transactionReceipt,
      active_plan: true,
    };
    // const product = await stripe.products.create({
    //   name: req.body.title,
    // });

    // const plan = await stripe.plans.create({
    //   amount: req.body.amount * 100,
    //   currency: "usd",
    //   interval: "month",
    //   product: product.id,
    // });

    const newPlan = new Plan(data);

    const savedPlan = await newPlan.save();
    const updateUser = await User.findByIdAndUpdate(req.user, {
      subscriptionId: savedPlan._id,
    });
    if (savedPlan) {
      return res.json({
        message: "Plan will be created",
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
    const { page, pageSize } = req.query;
    const { 
      transaction_id = "", 
      user_detail = "", 
      startDate, 
      endDate 
    } = req.query?.query || {};

    const pageNum = parseInt(page) || 1;
    const pageSizeNum = parseInt(pageSize) || 10;
    const startIndex = (pageNum - 1) * pageSizeNum;
    
    const query = {};

    if (transaction_id) {
      query.transactionId = { $regex: transaction_id, $options: "i" };
    }

    if (user_detail) {
      const user_name = { $regex: user_detail, $options: "i" };
      const matchingUsers = await User.find({ firstName: user_name }).select("_id");
      const userIds = matchingUsers.map(user => user._id);
      if (userIds.length > 0) {
        query.user = { $in: userIds };
      }
    }

    if (startDate && endDate) {
      query.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }
    const totalPlans = await Plan.countDocuments(query);
    const totalPages = Math.ceil(totalPlans / pageSizeNum);

    const allPlans = await Plan.find(query)
      .populate({ path: "subscription" })
      .populate("user")
      .sort({ createdAt: -1 }) 
      .skip(startIndex)
      .limit(pageSizeNum);

    const paginationInfo = {
      currentPage: pageNum,
      totalPages: totalPages,
      pageSize: pageSizeNum,
      totalPlans: totalPlans,
    };
    console.log("allPlans", allPlans)
    return res.json({ plans: allPlans, paginationInfo: paginationInfo });
  } catch (error) {
    console.error("Error in getAllPlans:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getPlanById = async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);
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
    const updatedPlan = await Plan.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
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
    const deletedPlan = await Plan.findByIdAndDelete(req.params.id);

    if (!deletedPlan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    if (deletedPlan.stripeplan) {
      const deletedStripePlan = await stripe.plans.del(deletedPlan.stripeplan);
      console.log(deletedStripePlan, "Checking plan deletion from Stripe");

      return res.json({
        message: "Plan deleted successfully",
        // deletedPlan,
      });
    } else {
      console.log("stripeplan is null or undefined");
    }

    return res.json({ message: "Plan deleted successfully" });
  } catch (error) {
    console.error("Error in deletePlanById:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const activeplan = async (req, res) => {
  const { id } = req.params;

  try {
    const plan = await Plan.findById(id);

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
