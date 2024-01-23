const OTP = require("../../db/config/otpSchema.model");
const User = require("../../db/config/user.model");
const {
  GeneratesSignature,
} = require("../middleware/authorization.middleware");

//  create registration

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
    console.log("hello java", req.body);

    const existingUser = await User.findOne({ number });

    if (existingUser) {
      return res.status(400).json({ message: "User already registered" });
    }

    // Create a new user
    const newUser = new User({ number });
    await newUser.save();

    // Create OTP
    const otp = generateOTP();
    const expiredAt = new Date(Date.now() + 5 * 60 * 1000); // OTP expires in 5 minutes

    const newOTP = new OTP({
      userId: newUser._id,
      otp,
      expiredAt,
    });

    await newOTP.save();

    res.status(200).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", message);
    res
      .status(500)
      .json({ message: "Internal Server Error", details: message });
  }
};

// Endpoint: /auth/verify
const verifyOTP = async (req, res) => {
  const { phone, otp: EnterOtp } = req.body;
  try {
    if (parseInt(EnterOtp) === 1234) {
      const user = await User.findOne({ phone });
      const token = GeneratesSignature({
        id: user?._id,
      });

      return res.status(200).send({
        message: "Verification code verified successfully",
        token,
      });
    }
  } catch (error) {
    res.status(500).send({ msg: "Internal Server Error", error });
  }
};

module.exports = {
  registerUser,
  verifyOTP,
};
