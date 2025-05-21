// routes/welcomeEmail.js
const express = require('express');
const router = express.Router();
const WelcomeEmailSetting = require('../../db/models/setting.model');



const getWelcomeMail =async (req, res)=>{
  const setting = await WelcomeEmailSetting.findOne();
  res.json(setting);
};

const updateWelecomeMail =async (req, res)=>{
  const { subject, body } = req.body;

  let setting = await WelcomeEmailSetting.findOne();
  if (setting) {
    setting.title = subject;
    setting.description = body;
  } else {
    setting = new WelcomeEmailSetting({ title:subject, description:body });
  }

  await setting.save();
  res.json({ message: 'Welcome email updated successfully', setting });
};

module.exports = {
    getWelcomeMail,
    updateWelecomeMail,
  };
