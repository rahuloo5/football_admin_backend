const express = require("express");

const { authMiddleware } = require("../middleware/authorization.middleware");
const {
  adddevice,
  getAllDevices,
  createDevice,
  deleteDevice,
} = require("./device.controller");
const { deviceIcons, deviceImages } = require("../utility/picture");

const router = express.Router();

//Content API
router.post("/add-device", deviceImages, createDevice);
router.get("/get-device", getAllDevices);

router.delete("/delete-device/:id", authMiddleware, deleteDevice);

module.exports = router;
