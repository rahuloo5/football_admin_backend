// const twilio = require("twilio");

// const accountSid = "AC53acf0c303c557b13a2999a68af36f9a";
// const authToken = "6e2e2ca9875616f61346c7fa6ed06adf";
// const client = new twilio(accountSid, authToken);

// const sendSMS = async (to, body) => {
//   try {
//     const message = await client.messages.create({
//       body: body,
//       from: "+919074313441",
//       to: "+916260483976",
//     });

//     console.log(`SMS sent successfully. SID: ${message.sid}`);
//   } catch (error) {
//     console.error("Error sending SMS:", error.message);
//   }
// };

// // Example usage
// sendSMS("+919074313441", "Hello, this is a Twilio SMS!");

// module.exports = sendSMS;
