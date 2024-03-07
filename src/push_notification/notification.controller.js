// const { sendPushNotification } = require("../utility/push_notification");
const Notification = require("../../db/config/notification.model");

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

module.exports = {
  //   createnotification,
};
