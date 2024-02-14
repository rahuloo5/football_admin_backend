const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Plan = require("../../db/config/plan.model");
const User = require("../../db/config/user.model");

const createpayment = async (req, res) => {
  try {
    const { name, amount, planId, email } = req.body;
    console.log("fghjklqwerthdf", req.body);

    let user = req.user;

    const updatedUser = await User.findById(user?._id);
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the plan is present
    const plan = await Plan.findById(planId);
    if (!plan) {
      return res.status(404).json({ error: "Plan not found" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: plan?.amount,
      currency: "usd",
      email: updatedUser.email,
      capture_method: "automatic",
    });

    const session = await stripe.products
      .create({
        name: updatedUser.firstname,
      })
      .then(async ({ id }) => {
        return await stripe.prices.create({
          product: id,
          unit_amount: plan?.amount * 100,
          currency: "usd",
        });
      })
      .then(async ({ id }) => {
        return await stripe.checkout.sessions.create({
          mode: "payment",
          line_items: [
            {
              price: id,
              quantity: 1,
            },
          ],
          invoice_creation: {
            enabled: true,
            invoice_data: {
              custom_fields: [
                { name: "Description", value: plan?.description },
                { name: "Amount", value: plan?.amount },
              ],
              footer: "secure your living",
            },
          },
          metadata: { planId },
          payment_intent: paymentIntent?.id,
          success_url: `${req.protocol}://${req.get("host")}/payment_success`,
          cancel_url: `${req.protocol}://${req.get("host")}/payment_failed`,
        });
      });

    console.log(session, "denfue");
    if (session) {
      let subscribe = await subscription.create({
        userId: user?._id,
        planId: planId,
        status: session?.payment_status,
        stripeSubscriptionId: session?.id,
        renewDate: moment().add(1, "month"),
        amount: session?.amount_total / 100,
      });
      console.log(user);
    }
    return res.json({
      url: session.url,
      session,
    });
  } catch (error) {
    console.log(error.message);
    throw error;
  }
};

module.exports = {
  createpayment,
};
