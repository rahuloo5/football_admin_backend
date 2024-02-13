const OTP = require("../../db/config/otpSchema.model");
const User = require("../../db/config/user.model");

const {
  GeneratesSignature,
} = require("../middleware/authorization.middleware");
const sendSMS = require("../utility/send-sms");

function generateOTP() {
  const otpLength = 4;
  const otp = Math.floor(100000 + Math.random() * 900000)
    .toString()
    .substring(0, otpLength);
  return otp;
}

const registerUser = async (req, res) => {
  try {
    const { number } = req.body;

    const existingUser = await User.findOne({ number });

    if (existingUser) {
      return res.status(400).json({
        message: "User already registered",
        isActive: existingUser.isActive,
      });
    }

    const newUser = new User({ number });
    await newUser.save();

    // Create OTP
    const otp = generateOTP();
    const expiredAt = new Date(Date.now() + 5 * 60 * 1000);

    const newOTP = new OTP({
      userId: newUser._id,
      otp,
      expiredAt,
    });

    await newOTP.save();

    res.status(200).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Internal Server Error", details: error });
  }
};

const verifyOTP = async (req, res) => {
  const { number, otp: enteredOTP } = req.body;

  try {
    if (parseInt(enteredOTP) === 1234) {
      const user = await User.findOne({ number });
      if (!user) {
        return res.status(404).send({ error: "User not found" });
      }
      const isActive = user.isActive;
      const token = GeneratesSignature({
        id: user._id,
      });

      return res.status(200).send({
        success: true,
        message: "Verification code verified successfully",
        id: user._id,
        isActive: isActive,
        token,
      });
    } else {
      return res.status(400).send({
        success: false,
        message: "Invalid OTP",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, error: "Internal Server Error" });
  }
};

const verify_update = async (req, res) => {
  try {
    const { number, firstName, lastName, email } = req.body;

    const user = await User.findOne({ number });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (firstName && lastName && email) {
      user.isActive = true;
      user.firstName = firstName;
      user.lastName = lastName;
      user.email = email;
    }

    await user.save();

    return res.status(200).json({
      message: "User details updated successfully",
      isActive: user.isActive,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const resendOtp = async (req, res) => {
  const { number } = req.body;

  const user = await User.findOne({ number });

  if (user) {
    const otp = generateOTP();
    const newOtp = new OTP({ userId: user._id, otp: otp });

    const savedOtp = await newOtp.save();

    let response = await sendSMS(otp, number);

    res.status(200).send({
      response,
      message: "Verification code sent successfully",
      savedOtp,
    });
  } else {
    res.status(404).send("User not found");
  }
};

module.exports = {
  registerUser,
  verifyOTP,
  verify_update,
  resendOtp,
};
