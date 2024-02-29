// const { sendPushNotification } = require("../utility/push_notification");

// const createnotification = async (req, res) => {
//   const { token, title, body } = req.body;

//   if (!token || !title || !body) {
//     return res.status(400).json({ error: "Missing required parameters" });
//   }

//   try {
//     await sendPushNotification(token, title, body);
//     return res
//       .status(200)
//       .json({ success: true, message: "Notification sent successfully" });
//   } catch (error) {
//     console.error("Error:", error);
//     return res
//       .status(500)
//       .json({ error: "Internal Server Error", details: error });
//   }
// };

//fake notification

const notification = async (req, res) => {
  try {
    const { title } = req.body;
    const newNotification = new Notification({ title });
    const savedNotification = await newNotification.save();
    res.json(savedNotification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Read (Get all notifications)
const allnotification = async (req, res) => {
  try {
    const notifications = await Notification.find();
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  //   createnotification,
  notification,
  allnotification,
};
