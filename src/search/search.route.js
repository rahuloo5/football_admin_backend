const express = require("express");
const { authMiddleware } = require("../middleware/authorization.middleware");
const {
  createItem,
  getAllItems,
  updateItem,
  deleteItem,
  getItemById,
} = require("./search.controller");

const router = express.Router();

//search API

// Create
router.post("/search", authMiddleware, createItem);

// Read
router.get("/search", getAllItems);

// Update
router.put("/search/:id", authMiddleware, updateItem);

//search by id
router.get("/search/:id", authMiddleware, getItemById);

// Delete
router.delete("/search/:id", authMiddleware, deleteItem);

module.exports = router;
