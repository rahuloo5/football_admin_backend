const express = require("express");
const { authMiddleware } = require("../middleware/authorization.middleware");
const { createsubcription } = require("./sub.controller");

const router = express.Router();

router.post("/create-subscription", authMiddleware, createsubcription);

// router.delete("/plans/:id", authMiddleware, deletePlanById);

module.exports = router;
