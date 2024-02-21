const express = require("express");
const { sendNotification } = require("../user/user.controller");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const subscriptionWebhook = async (req, res) => {
  const payload = req.body;

  try {
    const event = stripe.webhooks.constructEvent(
      req.rawBody,
      req.headers["stripe-signature"],
      "whsec_4b420df130f510b3a273003d4ed78fd7feab539a0f7d0b19485e36f7ec030734"
    );

    handleStripeEvent(event);

    res.status(200).send("Webhook Received");
  } catch (err) {
    console.error("Webhook Error:", err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
};

function handleStripeEvent(event) {
  switch (event.type) {
    case "payment_intent.succeeded":
      sendNotification("Payment Succeeded", event.data.object);
      break;
    case "payment_intent.failed":
      sendNotification("Payment Failed", event.data.object);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
}

module.exports = {
  subscriptionWebhook,
};
