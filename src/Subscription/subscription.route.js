const express = require("express");
const { authMiddleware } = require("../middleware/authorization.middleware");

const {
  createsubscription,
  getAllsubscription,
  getsubscriptionById,
  updateSubscription,
  deleteSubscription,
} = require("./subscription.controller");

const router = express.Router();

// device API
router.post("/subscription", authMiddleware, createsubscription);
router.get("/subscription", authMiddleware, getAllsubscription);
router.get("/subscription/:id", authMiddleware, getsubscriptionById);
router.patch("subscription/:id", authMiddleware, updateSubscription);
router.delete("subscription/:id", authMiddleware, deleteSubscription);

module.exports = router;
