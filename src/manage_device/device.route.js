const express = require("express");
const { authMiddleware } = require("../middleware/authorization.middleware");
const { deviceIcons, deviceImage } = require("../utility/picture");

const {
  getAllDevices,
  getDeviceById,
  updateDevice,
  deleteDevice,
  createDevice,
} = require("./device.controller");

const router = express.Router();

// device API
router.post("/devices", authMiddleware, createDevice);
router.get("/devices", authMiddleware, getAllDevices);
router.get("/devices/:id", authMiddleware, getDeviceById);
router.patch(
  "/devices/:id",
  authMiddleware,
  // deviceImage,
  // deviceIcons,
  updateDevice
);
router.delete("/devices/:id", authMiddleware, deleteDevice);

module.exports = router;
