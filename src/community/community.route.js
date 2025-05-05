const express = require("express");
const { authMiddleware } = require("../middleware/authorization.middleware");
const {
    updateRequest,
    getRequest
} = require("./community.controller");

const router = express.Router();

//Content API have to add middleware
router.patch("/requests/:id/status",authMiddleware, updateRequest);
router.get("/requests",authMiddleware, getRequest);


module.exports = router;
