const OTP = require("../../db/config/otpSchema.model");
const TempOTP = require("../../db/config/tamp.model");
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

// const registerUser = async (req, res) => {
//   try {
//     const { number } = req.body;

//     const existingUser = await User.findOne({ number });
//     const otp = generateOTP();
//     if (existingUser) {
//       // const newOtp = new OTP({ userId: existingUser._id, otp: otp });

//       let savedotp = await TempOTP.findOneAndUpdate(
//         { userId: existingUser._id },
//         { userId: existingUser._id, otp: otp },
//         { upsert: true }
//       );

//       let response = await sendSMS(savedotp?.otp, existingUser?.number);

//       return res.status(400).json({
//         message: "User already registered",
//         number: existingUser.number,
//         isActive: existingUser.isActive,
//         response,
//       });
//     }

//     const newUser = new User({ number });
//     let firstsaveduser = await newUser.save();

//     // Create OTP

//     let sotp = await TempOTP.create({
//       userId: firstsaveduser?._id,
//       otp: otp,
//     });

//     let responses = await sendSMS(otp, firstsaveduser?.number);

//     res
//       .status(200)
//       .json({ message: "User registered successfully", responses });
//   } catch (error) {
//     console.error("Error registering user:", error);
//     res.status(500).json({ error: "Internal Server Error", details: error });
//   }
// };

// const verifyOTP = async (req, res) => {
//   const { number, otp: enteredOTP } = req.body;

//   try {
//     const user = await User.findOne({ number });

//     if (!user) {
//       return res.status(404).send({ error: "User not found" });
//     }

//     const storedOTPRecord = await TempOTP.findOne({ userId: user._id });

//     if (storedOTPRecord && parseInt(enteredOTP) === storedOTPRecord.otp) {
//       const isActive = user.isActive;
//       const token = GeneratesSignature({
//         id: user._id,
//       });

//       // Remove the OTP record from the temporary collection after verification
//       await TempOTP.deleteOne({ userId: user._id });

//       return res.status(200).send({
//         success: true,
//         message: "Verification code verified successfully",
//         id: user._id,
//         isActive: isActive,
//         token,
//       });
//     } else {
//       return res.status(400).send({
//         success: false,
//         message: "Invalid OTP",
//       });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).send({ success: false, error: "Internal Server Error" });
//   }
// };

const registerUser = async (req, res) => {
  try {
    const { number, fcm_token } = req.body;
    console.log("asdfghsdfg", req.body);
    const existingUser = await User.findOne({ number });
    // const otp = generateOTP();
    // let savedotp;

    const otp = "1234";

    let savedotp;

    if (existingUser) {
      savedotp = await TempOTP.findOneAndUpdate(
        { userId: existingUser._id },
        { userId: existingUser._id, otp: otp },
        { upsert: true, new: true }
      );
    } else {
      const newUser = new User({ number, fcm_token });
      let firstsaveduser = await newUser.save();

      // Create OTP
      savedotp = await TempOTP.create({
        userId: firstsaveduser?._id,
        otp: otp,
      });
    }

    // let response = await sendSMS(otp, number);

    let response = await (otp, number);

    res.status(200).json({
      message: existingUser
        ? "User already registered"
        : "User registered successfully",
      response,
      number: existingUser?.number || savedotp.userId,
      isActive: existingUser?.isActive || false,
      response: {
        body: `Sent from your Twilio trial account - Your OTP is ${savedotp?.otp}`,
      },
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Internal Server Error", details: error });
  }
};

const verifyOTP = async (req, res) => {
  const { number, otp: enteredOTP } = req.body;

  try {
    const user = await User.findOne({ number });

    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    const storedOTPRecord = await TempOTP.findOne({ userId: user._id });

    if (storedOTPRecord && parseInt(enteredOTP) === storedOTPRecord.otp) {
      const isActive = user.isActive;
      const token = GeneratesSignature({
        id: user._id,
      });

      // Remove the OTP record from the temporary collection after verification
      await TempOTP.deleteOne({ userId: user._id });

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

    await TempOTP.findOneAndUpdate(
      { userId: user._id },
      { userId: user._id, otp: otp },
      { upsert: true }
    );
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
