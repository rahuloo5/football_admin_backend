const mongoose = require("mongoose");
const Category = require("../../db/config/categories.model");
const manageDevice = require("../../db/config/devicemanage.model");

const createDevice = async (req, res) => {
  try {
    const {
      device_name,
      categoryId,
      device_terms,
      overall_security,
      overall_privacy,
      security_tips,
      video_urls,

      device_policies,
      product_purchase_info,
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid category ID" });
    }

    const category = await Category.findById(categoryId);

    if (!category) {
      return res
        .status(404)
        .json({ success: false, error: "Category not found" });
    }

    const Icons = req.files ? req.files.map((file) => file.filename) : null;
    const Images = req.files ? req.files.map((file) => file.filename) : null;

    const newDevice = new manageDevice({
      device_name,
      overall_security,
      category: categoryId,
      overall_privacy,
      security_tips,
      device_terms,
      device_policies,
      Icons,
      Images,
      video_urls,
      product_purchase_info,
    });

    await newDevice.save();

    res.status(201).json({
      success: true,
      message: "device created successfully",
      data: newDevice,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

const getAllDevices = async (req, res) => {
  try {
    const devices = await manageDevice.find().populate("category");

    res.status(200).json({
      success: true,
      message: "Devices retrieved successfully",
      data: devices,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

const deleteDevice = async (req, res) => {
  try {
    const deviceId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(deviceId)) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid device ID" });
    }

    const device = await manageDevice.findById(deviceId);

    if (!device) {
      return res
        .status(404)
        .json({ success: false, error: "Device not found" });
    }

    await manageDevice.deleteOne({ _id: deviceId });

    res.status(200).json({
      success: true,
      message: "Device deleted successfully",
      data: device,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

module.exports = {
  createDevice,
  getAllDevices,
  deleteDevice,
};
