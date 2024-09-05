const express = require("express");
const { authMiddleware } = require("../middleware/authorization.middleware");
const {
  CreateTerms,
  getTerms,
  getTermsById,
  updateTerms,
  deleteTerms,
} = require("./terms.controller");

const router = express.Router();

//Content API
router.post("/add_terms", authMiddleware, CreateTerms);
router.get("/get_terms", authMiddleware, getTerms);
router.get("/get_terms/:id", authMiddleware, getTermsById);
router.put("/update_terms/:id", authMiddleware, updateTerms);
router.delete("/delete_terms/:id", authMiddleware, deleteTerms);

module.exports = router;
