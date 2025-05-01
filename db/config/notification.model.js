const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
  title: String,
  description: String,
  category: String,
  ageGroup: String,
  level: String,
  position: String,
  dateSent: {
    type: Date,
    default: Date.now,
  },
});

const Notification = mongoose.model('Notification', NotificationSchema);

module.exports = Notification;
