const mongoose = require("mongoose");
const Category = require("../../db/config/categories.model");
const Device = require("../../db/config/device.model");

// / Get all devices
const createDevice = async (req, res) => {
  try {
    const {
      device_name,
      description,
      privacy_overview: { title1, description1 },
      secuirty_overview: { title2, description2 },
      other_information: { title3, description3 },
      terms_conditions: { title4, description4 },

      categoryId,
      video_url1,
      policy_url1,
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid category or subcategory ID" });
    }

    // Fetch the category
    const category = await Category.findById(categoryId);

    if (!category) {
      return res
        .status(404)
        .json({ success: false, error: "Category or subcategory not found" });
    }

    const deviceImages = req.files["deviceImages"];
    const numDeviceImages = deviceImages.length;
    const device = new Device({
      device_name,
      deviceImages: req.files["deviceImages"].map((file) => file.filename),

      deviceIcons: req.files["deviceIcons"][0].filename,
      video_url: req.files["video_url"][0].filename,
      policy_url: req.files["policy_url"][0].filename,
      privacy_overview: { title1, description1 },
      secuirty_overview: { title2, description2 },
      other_information: { title3, description3 },
      terms_conditions: { title4, description4 },
      description,
      video_url1,
      policy_url1,
      categorie: categoryId,
    });

    await device.save();

    res.status(200).json(device, numDeviceImages, numVideos);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

const getAllDevices = async (req, res) => {
  try {
    const categoryId = req.query.categoryId;

    const query = categoryId ? { categorie: categoryId } : {};

    const devices = await Device.find(query).populate("categorie");

    res.status(200).json(devices);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

// Get a single device by ID
const getDeviceById = async (req, res) => {
  try {
    const deviceId = req.params.id;
    const device = await Device.findById(deviceId).populate("categorie");

    if (!device) {
      return res.status(404).json({ error: "Device not found" });
    }

    res.status(200).json(device);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update a device by ID
const updateDevice = async (req, res) => {
  try {
    const deviceId = req.params.id;
    const updateData = req.body;

    const updatedDevice = await Device.findByIdAndUpdate(deviceId, updateData, {
      new: true,
    }).populate("categorie sub_categorie");

    if (!updatedDevice) {
      return res.status(404).json({ error: "Device not found" });
    }

    res.status(200).json(updatedDevice);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Delete a device by ID
const deleteDevice = async (req, res) => {
  try {
    const deviceId = req.params.id;

    const deletedDevice = await Device.findByIdAndDelete(deviceId).populate(
      "categorie sub_categorie"
    );

    if (!deletedDevice) {
      return res.status(404).json({ error: "Device not found" });
    }

    res.status(200).json(deletedDevice);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getAllDevices,
  getDeviceById,
  updateDevice,
  deleteDevice,
  createDevice,
};
