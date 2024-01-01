const Screen = require("../../db/config/screen.model");

// add scrren
const getaddscreen = async (req, res) => {
  try {
    const { title } = req.body;

    const screen_image = req.file ? req?.file?.filename : null;

    const newScreen = new Screen({ title, screen_image });
    console.log("asdtyasdfgzxcvasert", newScreen);

    await newScreen.save();

    res.status(201).json(newScreen);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get all screen
const getAllscreen = async (req, res) => {
  try {
    const allscreens = await Screen.find();

    res.status(200).json(allscreens);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getaddscreen,
  getAllscreen,
};
