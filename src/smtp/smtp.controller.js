const Smtp = require("../../db/models/smtp.model");

const express = require("express");
const { smtpSchema } = require("./smtp.dto");
const router = express.Router();

// const createsmtp = async (req, res) => {
//   try {
//     const { host, port, user, password } = req.body;

//     let createdSmtp = await Smtp.create({
//       slug: "#smtp",
//       host: host,
//       port: port,
//       user: user,
//       password: password,
//     });

//     if (createdSmtp) {
//       return res.status(200).json({
//         message: "SMTP configuration created successfully",
//         row: createdSmtp,
//       });
//     }
//   } catch (err) {
//     console.error(err, "checking error");
//     return res.status(500).json({ message: "Internal Server Error" });
//   }
// };

// const getallsmtp = async (req, res) => {
//   try {
//     let allsmtp = await Smtp.find({ slug: "#smtp" });
//     if (allsmtp) {
//       return res.status(200).json({
//         rows: allsmtp,
//       });
//     }
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({
//       message: "Internal Server error",
//     });
//   }
// };

const createsmtp = async (req, res) => {
  try {
    const newSmtp = new Smtp(req.body);
    const savedSmtp = await newSmtp.save();
    res.json(savedSmtp);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getallsmtp = async (req, res) => {
  try {
    const smtpList = await Smtp.find();
    res.json(smtpList);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updatesmtp = async (req, res) => {
  try {
    const { error } = new Smtp(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const updatedSmtp = await Smtp.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!updatedSmtp) {
      return res.status(404).json({ error: "Smtp not found" });
    }

    res.json(updatedSmtp);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deletesmtp = async (req, res) => {
  try {
    const deletedSmtp = await Smtp.findByIdAndDelete(req.params.id);
    res.json(deletedSmtp);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = router;

module.exports = {
  createsmtp,
  getallsmtp,
  updatesmtp,
  deletesmtp,
};
