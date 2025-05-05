
const express = require('express');
const User = require('../../db/config/user.model');
const nodemailer = require('nodemailer');
const Notification = require('../../db/config/notification.model')


const sendNotification=async (req,res) =>{

  try {
    const { ageGroup, level, position, title, description } = req.body;
    console.log(req.body,"body")

    const [minAge, maxAge] = ageGroup.split('-').map(Number);
    const users = await User.find({
      age: { $gte: minAge, $lte: maxAge },
      level: level,
      position: position
    });

    if (!users.length) {
      return res.status(404).json({ message: 'No users found with the given criteria.' });
    }
    const notification = new Notification({
      title,
      category:'category1',
      description,
      ageGroup,
      level,
      position,
     
    });

    await notification.save();
    // const userIds = users.map(user => user._id);

    // // Step 2: Send Email (you can use nodemailer, SendGrid, etc.)
    // for (const user of users) {
    //   await sendEmail({
    //     to: user.email,
    //     subject: title,
    //     text: description
    //   });
    // }

    const transporter = nodemailer.createTransport({
      service: 'gmail', // or your email provider
      auth: {
        user: process.env.NOTIFICATION_SENDER_EMAIL,
        pass: process.env.NOTIFICATION_SENDER_ID
      }
    });

    // Send emails in parallel
    await Promise.all(
      users.map(user =>
        transporter.sendMail({
          from: process.env.EMAIL,
          to: user.email,
          title,
          text: description
        })
      )
    );
    

    res.status(200).json({
      message: 'Notification sent and saved successfully.',
      notification
    });

    res.status(200).json({ message: 'Emails sent successfully' });
  } catch (error) {
    console.error('Email sending error:', error);
    res.status(500).json({ error: 'Failed to send emails' });
  }
};

const getNotification = async(req,res) =>{
  try {
    const notifications = await Notification.find()
      .sort({ dateSent: -1 }); 

    res.status(200).json({ success: true, data: notifications });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}
module.exports = {sendNotification,getNotification};
