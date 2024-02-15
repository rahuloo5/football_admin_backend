const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Plan = require("../../db/config/plan.model");
const User = require("../../db/config/user.model");

const createpayment = async (req, res) => {
  try {
    const { firstName, amount, planId, email, UserId, description } = req.body;

    //find user by id

    const updatedUser = await User.findById(UserId);
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // console.log("User found:", updatedUser);

    //find plan by id

    const plan = await Plan.findById(planId);
    if (!plan) {
      return res.status(404).json({ error: "Plan not found" });
    }

    // console.log("plan found:", plan);

    // create customer

    const customer = await stripe.customers.create({
      email: email,
    });

    console.log("Stripe Customer created:", customer);

    // create product

    const product = await stripe.products.create({
      firstName: firstName,
      description: description,
      type: "service",
    });

    console.log("Stripe Customer created:", product);

    //creating stripe prices

    const price = await stripe.prices.create({
      product: id,
      amount: amount * 100,
      currency: currency,
    });

    console.log("Stripe Price created:", price);

    const subscription = await stripe.subscriptions.create({
      customer: customer?.id,
      items: checkingPrices,
      payment_behavior: "default_incomplete",
      expand: ["latest_invoice.payment_intent"],
    });

    let respond = {
      client_secret: subscription.latest_invoice.payment_intent.client_secret,
      subscriptionId: subscription.id,
    };
    return respond;
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  createpayment,
};
