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
    const Icons = req.Icons
      ? req.files
          .filter((item) => item.fieldname === "Icons")
          .map((file) => file.filename)
      : null;
    const Images = req.Images
      ? req.files
          .filter((item) => item.fieldname === "Images")
          .map((file) => file.filename)
      : null;
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
    res.status(500).json({ success: false, error: error });
  }
};

const editDevice = async (req, res) => {
  try {
    const data = req.body;
    if (!mongoose.Types.ObjectId.isValid(data.categoryId)) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid category ID" });
    }
    const category = await Category.findById(data.categoryId);
    if (!category) {
      return res
        .status(404)
        .json({ success: false, error: "Category not found" });
    }
    const Icons = req.Icons
      ? req.files
          .filter((item) => item.fieldname === "Icons")
          .map((file) => file.filename)
      : null;
    const Images = req.Images
      ? req.files
          .filter((item) => item.fieldname === "Images")
          .map((file) => file.filename)
      : null;

    if (Icons) {
      data.Icons = Icons;
    }

    if (Images) {
      data.Images = Images;
    }

    const device = await manageDevice.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    res.status(201).json({
      success: true,
      message: "device created successfully",
      data: device,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error });
  }
};

const getAllDevices = async (req, res) => {
  try {
    const categoryId = req.query.categoryId;
    const deviceName = req.query.name;

    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;

    const startIndex = (page - 1) * pageSize;
    const endIndex = page * pageSize;

    const totalDevices = await manageDevice.countDocuments();
    const totalPages = Math.ceil(totalDevices / pageSize);

    const query = {};
    if (categoryId) {
      query.category = categoryId;
    }
    if (deviceName) {
      query.device_name = { $regex: deviceName, $options: "i" };
    }
    // console.log(query);
    // const query = categoryId ? { category: categoryId } : {};
    const devices = await manageDevice
      .find(query)
      .populate("category")
      .skip(startIndex)
      .limit(pageSize);

      const paginationInfo = {
        currentPage: page,
        totalPages: totalPages,
        pageSize: pageSize,
        totalDevices: totalDevices,
      };
     
      console.log("paginationInfo", paginationInfo)
    res.status(200).json({
      success: true,
      message: "Devices retrieved successfully",
      data: { devices, paginationInfo }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

const searchAllDevices = async (req, res) => {
  try {
    // const categoryId = req.query.categoryId;
    const filter = {};
    filter.device_name = { $regex: req.query.name, $options: "i" };
    const devices = await manageDevice.find(filter).populate("category");
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
const getDeviceById = async (req, res) => {
  try {
    const devices = await manageDevice.findById(req.params.id);

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
  getDeviceById,
  editDevice,
  searchAllDevices,
};
