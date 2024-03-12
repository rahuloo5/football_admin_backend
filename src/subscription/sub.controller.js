const express = require("express");
const { sendNotification } = require("../user/user.controller");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const subscriptionWebhook = async (req, res) => {
  const payload = req.body;
  const endpointSecret = "whsec_qxCIXtYQicCymC5u4N0JpDyVjuEaY3yk";
  console.log("dfgyuiasdfasdf", req.body);
  // const sig = req.headers["stripe-signature"];
  const header = stripe.webhooks.generateTestHeaderString({
    payload: JSON.stringify(req.body),
    secret: endpointSecret,
  });
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      JSON.stringify(req.body),
      header,
      endpointSecret
    );
  } catch (err) {
    console.log(err);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }
  console.log(event.type, "event");
  // Handle the event
  switch (event.type) {
    case "payment_intent.canceled":
      const paymentIntentCanceled = event.data.object;
      // Then define and call a function to handle the event payment_intent.canceled
      break;
    case "payment_intent.created":
      const paymentIntentCreated = event.data.object;
      // Then define and call a function to handle the event payment_intent.created
      break;
    case "payment_intent.payment_failed":
      const paymentIntentPaymentFailed = event.data.object;
      // Then define and call a function to handle the event payment_intent.payment_failed
      break;
    case "payment_intent.succeeded":
      const paymentIntentSucceeded = event.data.object;
      // Then define and call a function to handle the event payment_intent.succeeded
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
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
