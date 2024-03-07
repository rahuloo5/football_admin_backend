const express = require("express");

const { authMiddleware } = require("../middleware/authorization.middleware");
const {
  deletesubscription,
  addsubscription,
  updatesubscription,
  getsubscriptionbyId,
  getAllsubscription,

  //fake notification

  notification,
  allnotification,
  getTotalAmount,
} = require("./plan_subscription.controller");

const router = express.Router();

//Content API
router.post("/subscriptions", addsubscription);
router.delete("/subscriptions/:id", authMiddleware, deletesubscription);
router.patch("/subscriptions/:id", authMiddleware, updatesubscription);
router.get("/subscriptions/:id", authMiddleware, getsubscriptionbyId);
router.get("/subscriptionss", getAllsubscription);

// dashboard api for total number of subscrption and amount

router.get("/total-amount", getTotalAmount);

router.post("/notification", notification);
router.get("/notification", allnotification);

module.exports = router;
