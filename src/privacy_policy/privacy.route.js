const express = require("express");
const { authMiddleware } = require("../middleware/authorization.middleware");
const {
  CreatePolicy,
  getPolicy,
  getPolicyById,
  updatePolicy,
  deletePolicy,
} = require("./privacy.controller");

const router = express.Router();

//Content API
router.post("/add_policy", authMiddleware, CreatePolicy);
router.get("/get_policy", authMiddleware, getPolicy);
router.get("/get_policy/:id", authMiddleware, getPolicyById);
router.put("/update_policy/:id", authMiddleware, updatePolicy);
router.delete("/delete_policy/:id", authMiddleware, deletePolicy);

module.exports = router;
