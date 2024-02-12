// const twilio = require("twilio");

// const accountSid = process.env.TWILLIO_ACCOUNT_SID;
// const authToken = process.env.TWILLIO_AUTH_TOKEN;
// const number = process.env.TWILLIO_PHONE_NUMBER;

// const client = new twilio(accountSid, authToken);

// const sendSMS = async (to, body) => {
//   try {
//     const message = await client.messages.create({
//       body: body,
//       from: number,
//       to: to,
//     });

//     console.log(`SMS sent successfully. SID: ${message.sid}`);
//   } catch (error) {
//     console.error("Error sending SMS:", error.message);
//   }
// };

// // Example usage
// sendSMS("+919074313441", "Hello, this is a Twilio SMS!");

// module.exports = sendSMS;
