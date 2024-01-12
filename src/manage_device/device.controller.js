const Category = require("../../db/config/categories.model");
const Device = require("../../db/config/device.model");
const Subcategory = require("../../db/sub_categories.model");

const createDevice = async (req, res) => {
  try {
    const {
      device_name,
      categorieId,
      sub_categorieId,
      video_url,
      policy_url,
      secuirty_overview,
      privacy_overview,
      other_information,
    } = req.body;

    console.log("device data", req.body);

    // const Images = req.file ? req.file.filename : null;
    const Images = req.files ? req.files.map((file) => file.filename) : null;
    console.log("device-Images ", Images);

    const categorie = await Category.findById(categorieId);
    const sub_categorie = await Subcategory.findById(sub_categorieId);

    const devicedata = new Device({
      device_name,
      categorie,
      sub_categorie,
      video_url,
      Images,
      policy_url,
      secuirty_overview,
      privacy_overview,
      other_information,
    });

    await devicedata.save();

    res.status(201).json(devicedata);
  } catch (error) {
    console.error(error); // Log the actual error
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// / Get all devices
// const getAllDevices = async (req, res) => {
//   try {
//     const devices = await Device.find().populate("categorie sub_categorie");
//     res.status(200).json(devices);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };
// const getAllDevices = async (req, res) => {
//   try {
//     const devices = await Device.find().populate("categorie sub_categorie");

//     // Calculate the total number of images for each device
//     const devicesWithImageAndVideo = devices.map((device) => ({
//       ...device.toObject(),
//       totalImages: device.Images ? device.Images.length : 0,
//       video_url: device.video_url || null,
//     }));

//     res.status(200).json(devicesWithImageAndVideo);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

const getAllDevices = async (req, res) => {
  try {
    const devices = await Device.find().populate("categorie sub_categorie");
    const devicesWithImageAndVideo = devices.map((device) => ({
      ...device.toObject(),
      totalImages: device.Images ? device.Images.length : 0,
      video_url: device.video_url ? device.video_url.length : 0,
    }));

    res.status(200).json(devicesWithImageAndVideo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get a single device by ID
const getDeviceById = async (req, res) => {
  try {
    const deviceId = req.params.id;
    const device = await Device.findById(deviceId).populate(
      "categorie  sub_categorie"
    );

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
  createDevice,
  getAllDevices,
  getDeviceById,
  updateDevice,
  deleteDevice,
};
