const Smtp = require("../../db/config/smtp.model");

const express = require("express");
const router = express.Router();
const createsmtp = async (req, res) => {
  try {
    const { host, port, user, password } = req.body;

    let createdSmtp = await Smtp.create({
      slug: "#smtp",
      host: host,
      port: port,
      user: user,
      password: password,
    });

    if (createdSmtp) {
      return res.status(200).json({
        message: "SMTP configuration created successfully",
        row: createdSmtp,
      });
    }
  } catch (err) {
    console.error(err, "checking error");
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const getallsmtp = async (req, res) => {
  try {
    let allsmtp = await Smtp.find({ slug: "#smtp" });
    if (allsmtp) {
      return res.status(200).json({
        rows: allsmtp,
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Internal Server error",
    });
  }
};

module.exports = router;

module.exports = {
  createsmtp,
  getallsmtp,
};
