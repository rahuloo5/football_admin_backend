const express = require("express");
const { authMiddleware } = require("../middleware/authorization.middleware");
const { deviceImage } = require("../utility/picture");
const {
  createDevice,
  getAllDevices,
  getDeviceById,
  updateDevice,
  deleteDevice,
} = require("./device.controller");

const router = express.Router();

// device API
router.post("/devices", deviceImage, authMiddleware, createDevice);
router.get("/devices", authMiddleware, getAllDevices);
router.get("/devices/:id", authMiddleware, getDeviceById);
router.patch("/devices/:id", authMiddleware, deviceImage, updateDevice);
router.delete("/devices/:id", authMiddleware, deleteDevice);

module.exports = router;
