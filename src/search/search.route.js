const express = require("express");
const { authMiddleware } = require("../middleware/authorization.middleware");
const {
  addCount,
  getAllItems,
  getCount,
  updateItem,
  deleteItem,
  getItemById,
} = require("./search.controller");

const router = express.Router();

//search API

// Create
router.post("/addCount", authMiddleware, addCount);

// Read
router.get("/getCount", authMiddleware, getCount);

// Read
router.get("/search", authMiddleware, getAllItems);

// Update
router.put("/search/:id", authMiddleware, updateItem);

//search by id
router.get("/search/:id", authMiddleware, getItemById);

// Delete
router.delete("/search/:id", authMiddleware, deleteItem);

module.exports = router;
