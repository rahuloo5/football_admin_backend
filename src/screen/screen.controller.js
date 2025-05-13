const Screen = require("../../db/models/screen.model");

// add scrren

const getaddscreen = async (req, res) => {
  try {
    const { title } = req.body;
    const screen = new Screen({
      title,
      screen_image: req.files["screen_image"][0].filename,
      bg_image: req.files["bg_image"][0].filename,
    });
    await screen.save();
    res.status(201).json(screen);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

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
