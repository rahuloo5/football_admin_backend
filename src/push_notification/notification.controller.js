// const admin = require("firebase-admin");

// const serviceAccount = require("");
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: MONGO_URI,
// });

// const createnotification = (req, res) => {
//   const { deviceToken, title, body } = req.body;

//   console.log("sachin", req.body);

//   if (!deviceToken || !title || !body) {
//     return res.status(400).json({ error: "Missing required parameters" });
//   }

//   const message = {
//     notification: {
//       title,
//       body,
//     },
//     token: deviceToken,
//   };

//   admin
//     .messaging()
//     .send(message)
//     .then((response) => {
//       console.log("Successfully sent message:", response);
//       res
//         .status(200)
//         .json({ success: true, message: "Notification sent successfully" });
//     })
//     .catch((error) => {
//       console.error("Error sending message:", error);
//       res
//         .status(500)
//         .json({ success: false, error: "Error sending notification" });
//     });
// };

// module.exports = {
//   createnotification,
// };
