const express = require("express");
const { authMiddleware } = require("../middleware/authorization.middleware");

const {
  createsubscription,
  getsubscriptionById,
  updateSubscription,
  deleteSubscription,
  getAllSubscriptions,
} = require("./subscription.controller");

const router = express.Router();

// subscription API
router.post("/subscriptions", createsubscription);
router.get("/subscriptions", getAllSubscriptions);
router.get("/subscriptions/:id", getsubscriptionById);
router.patch("/subscriptions/:id", updateSubscription);
router.delete("/subscriptions/:id", deleteSubscription);

module.exports = router;
