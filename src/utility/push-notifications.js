const admin = require("../../firebaseAdmin");

async function sendPushNotification(token, title, body) {
  const message = {
    notification: {
      title,
      body,
    },
    token,
  };

  try {
    const response = await admin.messaging().send(message);
    console.log("Successfully sent message:", response);
    console.log("Notification Body:", body);
  } catch (error) {
    console.error("Error sending message:", error);
  }
}

module.exports = { sendPushNotification };
