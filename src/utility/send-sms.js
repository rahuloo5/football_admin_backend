// const twilio = require("twilio");

// const accountSid = "your_account_sid";
// const authToken = "your_auth_token";
// const client = new twilio(accountSid, authToken);

// const sendSMS = async (to, body) => {
//   try {
//     const message = await client.messages.create({
//       body: body,
//       from: "your_twilio_phone_number",
//       to: to,
//     });

//     console.log(`SMS sent successfully. SID: ${message.sid}`);
//   } catch (error) {
//     console.error("Error sending SMS:", error.message);
//   }
// };

// // Example usage
// sendSMS("+1234567890", "Hello, this is a Twilio SMS!");
