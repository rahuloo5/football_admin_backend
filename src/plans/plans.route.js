const express = require("express");
const { authMiddleware } = require("../middleware/authorization.middleware");
const {
  createPlan,
  getAllPlans,
  getPlanById,
  updatePlanById,
  activeplan,
  deletePlanById,
} = require("./plans.controller");

const router = express.Router();

router.post("/plans", authMiddleware, createPlan);

router.get("/plans", authMiddleware, getAllPlans);

router.get("/plans/:id", authMiddleware, getPlanById);

router.patch("/plans/:id", updatePlanById);

router.put("/plan_active/:id", activeplan);

router.delete("/plans/:id", authMiddleware, deletePlanById);

module.exports = router;
