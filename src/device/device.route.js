const express = require("express");

const { authMiddleware } = require("../middleware/authorization.middleware");
const {
  adddevice,
  getAllDevices,
  createDevice,
  deleteDevice,
  getDeviceById,
  editDevice,
  searchAllDevices,
} = require("./device.controller");
const { deviceIcons, deviceImages } = require("../utility/picture");

const router = express.Router();

//Content API
router.post("/add-device", deviceImages, createDevice);
router.patch("/device/:id", deviceImages, editDevice);
router.get("/get-device", getAllDevices);
router.post("/search-device", searchAllDevices);
router.get("/get-device/:id", getDeviceById);

router.delete("/delete-device/:id", authMiddleware, deleteDevice);

module.exports = router;
