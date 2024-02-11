const express = require("express");
const Plan = require("../../db/config/plan.model");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const createsubcription = async (req, res) => {
  try {
    const { planId } = req.body;
    let user = req.user;
    console.log(req.body, "cheking body is here");

    const updatedUser = await User.findById(user?._id);
    const plan = await Plan.findById(planId);

    if (plan.amount == 0) {
      let subc = await subscription.create({
        userId: updatedUser?._id,
        planId: plan?._id,
        status: "active",
        stripeSubscriptionId: "",
        renewDate: "",
        amount: 0,
      });
      await User.findByIdAndUpdate(updatedUser._id, {
        subscriptionId: subc._id,
      });
      return res.status(200).json({
        message: "you have choose free plan",
      });
    }

    if (!updatedUser.stripecustomer) {
      const cus = stripe.customer.create({
        email: updatedUser.email,
        name: updatedUser.firstname,
      });
      updatedUser.stripecustomer = cus.id;
      await updatedUser.save();
    }

    const ephemeralKey = await stripe.ephemeralKeys.create(
      { customer: updatedUser.stripecustomer },
      { apiVersion: "2023-10-16" }
    );

    console.log(ephemeralKey);
    const sub = await stripe.subscriptions.create({
      customer: updatedUser.stripecustomer,
      items: [{ price: plan.stripeplan }],
      payment_behavior: "default_incomplete",
      payment_settings: { save_default_payment_method: "on_subscription" },
      expand: ["latest_invoice.payment_intent"],
    });

    let plans = await Plan.findOne({
      stripeplan: sub.plan.id,
    });

    let User = await User.findOne({ stripecustomer: sub.customer });

    let subc = await subscription.create({
      userId: User?._id,
      planId: plans?._id,
      status: sub?.status,
      stripeSubscriptionId: sub?.id,
      renewDate: moment().add(1, "month"),
      amount: sub?.plan.amount,
    });
    let notification = await Notification.create({
      user: subc?.userId,
      message: `${subc?.amount} paid for subscription
                  `,
    });
    await Usermodel.findByIdAndUpdate(updatedUser._id, {
      subscriptionId: subc._id,
    });

    return res.json({
      message: "success",
      client_secret: sub.latest_invoice.payment_intent.client_secret,
      ephemeralKey: ephemeralKey.secret,
      customer: sub.customer,
      publishableKey:
        "pk_test_51BTUDGJAJfZb9HEBwDg86TN1KNprHjkfipXmEDMb0gSCassK5T3ZfxsAbcgKVmAIXF7oZ6ItlZZbXO6idTHE67IM007EwQ4uN3",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: err,
    });
  }
};

module.exports = {
  createsubcription,
};
