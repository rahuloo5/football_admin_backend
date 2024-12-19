const twilio = require("twilio");

const sendSMS = async (otp, number) => {
  try {
    const accountSid = process.env.TWILLIO_ACCOUNT_SID;
    const authToken = process.env.TWILLIO_AUTH_TOKEN;
    const twilioPhoneNumber = process.env.TWILLIO_PHONE_NUMBER;

    const client = require("twilio")(accountSid, authToken);

    const response = await client.messages.create({
      body: `Your Secure Your Living OTP is ${otp}. Please do not share this otp with anyone`,
      from: twilioPhoneNumber,
      to: `+1${number}`,
    });

    console.log(response);

    return response;
  } catch (error) {
    console.error("Twilio error:", error);

    return { error: "Failed to send SMS", details: error.message };
  }
};

module.exports = sendSMS;
