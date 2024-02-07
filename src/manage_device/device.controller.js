const mongoose = require("mongoose");
const Category = require("../../db/config/categories.model");
const Device = require("../../db/config/device.model");

// const createDevice = async (req, res) => {
//   try {
//     const {
//       device_name,
//       categorieId,
//       sub_categorieId,
//       video_url,
//       policy_url,
//       secuirty_overview,
//       privacy_overview,
//       other_information,
//     } = req.body;

//     const Images = req.files ? req.files.map((file) => file.filename) : null;
//     const Icons = req.files ? req.files.map((file) => file.filename) : null;

//     console.log("device data", req.body);
//     console.log("device-Images ", Images);

//     const categorie = await Category.findById(categorieId);
//     const sub_categorie = await Subcategory.findById(sub_categorieId);

//     const devicedata = new Device({
//       device_name,
//       categorie,
//       sub_categorie,
//       video_url,
//       Images,
//       Icons,
//       policy_url,
//       secuirty_overview,
//       privacy_overview,
//       other_information,
//     });

//     await devicedata.save();

//     res.status(200).json(devicedata);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

// const createDevice = async (req, res) => {
//   try {
//     const {
//       device_name,
//       secuirty_overview,
//       privacy_overview,
//       categoryId,
//       other_information,
//     } = req.body;

//     const device = new Device({
//       device_name,
//       deviceImages: req.files["deviceImages"].map((file) => file.filename),
//       deviceIcons: req.files["deviceIcons"][0].filename,
//       video_url: req.files["video_url"][0].filename,
//       policy_url: req.files["policy_url"][0].filename,
//       secuirty_overview,
//       privacy_overview,
//       other_information,
//     });

//     await device.save();
//     res.status(201).json(device);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Internal Server Error");
//   }
// };
const createDevice = async (req, res) => {
  try {
    const {
      device_name,
      description,
      privacy_overview: { title1, description1 },
      secuirty_overview: { title2, description2 },
      other_information: { title3, description3 },
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

    const device = new Device({
      device_name,
      deviceImages: req.files["deviceImages"].map((file) => file.filename),
      deviceIcons: req.files["deviceIcons"][0].filename,
      video_url: req.files["video_url"][0].filename,
      policy_url: req.files["policy_url"][0].filename,
      privacy_overview: { title1, description1 },
      secuirty_overview: { title2, description2 },
      other_information: { title3, description3 },
      description,
      video_url1,
      policy_url1,
      categorie: categoryId,
    });

    await device.save();
    res.status(200).json(device);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

// / Get all devices

const getAllDevices = async (req, res) => {
  try {
    const devices = await Device.find();
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
  getAllDevices,
  getDeviceById,
  updateDevice,
  deleteDevice,
  createDevice,
};
