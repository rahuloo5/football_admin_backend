const express = require("express");
const { authMiddleware } = require("../middleware/authorization.middleware");
const { CreateTerms, getTerms, updateTerms } = require("./privacy.controller");

const router = express.Router();

//Content API
router.post("/terms_conditions", authMiddleware, CreateTerms);
router.get("/terms_conditions", authMiddleware, getTerms);
router.put("/terms_conditions/:id", authMiddleware, updateTerms);

module.exports = router;
