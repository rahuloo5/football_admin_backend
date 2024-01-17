// // const { OTP: OtpModal } = require("../../models/otpSchema");

// const handlebars = require("handlebars");
// const bcrypt = require("bcryptjs");
// const User = require("../../models/userSchema");
// const { sendEmailToAdmin } = require("../../utils/send.email");

// // const { sendSMS } = require("../../utils/send-sms");
// const {
//   GeneratesSignature,
// } = require("../middleware/authorization.middleware");
// const { otpSend } = require("../utility/common");

// // Create a new trainer
// exports.createUser = async (req, res) => {
//   try {
//     const { phone } = req.body;
//     const isUserExist = await User.findOne({ phone });
//     let savedUser;
//     if (isUserExist) {
//       const otp = otpSend();
//       const newOtp = new OtpModal({
//         userId: isUserExist?._id,

//         otp,
//       });
//       const savedOtp = await newOtp.save();
//       sendSMS(phone, `Your verification code is ${otp}`);
//       if (isUserExist.isOnboardingDone) {
//         res.status(201).send({ message: "User already registered" });
//         return;
//       }
//       res
//         .status(200)
//         .send("Verification code generated successfully, please check");
//       return;
//     } else {
//       const newUser = new User(req.body);
//       savedUser = await newUser.save();
//     }

//     const otp = otpSend();
//     const newOtp = new OtpModal({
//       userId: savedUser?._id || isUserExist?._id,
//       otp,
//     });
//     const savedOtp = await newOtp.save();
//     sendSMS(phone, `Your verification code is ${otp}`);
//     res
//       .status(200)
//       .send("Verification code generated successfully, please check");
//   } catch (err) {
//     if (err.code === 11000) {
//       const errorData = JSON.stringify(err.keyPattern);
//       res.status(400).send({ err: `${errorData} should be unique` });
//     } else {
//       res.status(500).json({ error: err });
//     }
//   }
// };

// // Function to verify-otp
// exports.verifyOtp = async (req, res) => {
//   const { phone, otp: EnterOtp } = req.body;
//   try {
//     if (parseInt(EnterOtp) == 1234) {
//       const user = await User.findOne({ phone });
//       const isOnboardingDone = user?.isOnboardingDone;
//       const token = GeneratesSignature({
//         id: user?._id,
//       });

//       return res.status(200).send({
//         message: "Verification code verified successfully",
//         token,
//         isOnboardingDone,
//       });
//     } else {
//       const getOtp = await OtpModal.aggregate([
//         {
//           $match: {
//             otp: parseInt(EnterOtp),
//             type: "REGISTER",
//           },
//         },
//         {
//           $lookup: {
//             from: "users",
//             localField: "userId",
//             foreignField: "_id",
//             as: "userInfo",
//           },
//         },
//         {
//           $match: { "userInfo.email": email },
//         },
//       ]);

//       if (getOtp.length) {
//         const user = getOtp?.[0]?.userInfo?.[0];

//         const token = GeneratesSignature({
//           id: user?._id,
//         });

//         return res.status(200).send({
//           message: "Verification code verified successfully",
//           token: token,
//         });
//       } else {
//         const errorCode = "verification code";
//         const response = {
//           [errorCode]: "Invalid verification code or Expired",
//         };
//         res.status(422).send(response);
//       }
//     }
//   } catch (error) {
//     res.status(500).send({ msg: "Internal Server Error", error });
//   }
// };

// // Login
// exports.loginUser = async (req, res) => {
//   const { email, password } = req.body;
//   const getTrainer = await User.findOne({ email: email });
//   if (!getTrainer) {
//     return res.status(401).json({ message: "Invalid credentials" });
//   }

//   // Compare passwords
//   const isPasswordValid = await bcrypt.compare(password, getTrainer.password);

//   if (!isPasswordValid) {
//     return res.status(401).json({ message: "Invalid credentials" });
//   }
//   const token = GeneratesSignature({
//     id: getTrainer._id,
//     role: getTrainer.role,
//   });
//   let isEmailVerified = getTrainer?.emailVerifiedAt;

//   if (isEmailVerified === null || isEmailVerified === undefined) {
//     isEmailVerified = false;
//   } else {
//     isEmailVerified = true;
//   }
//   const trainerPlan = getTrainer?.plan;
//   let plan;
//   if (trainerPlan == null || trainerPlan == undefined) {
//     plan = false;
//   } else {
//     plan = true;
//   }
//   res.status(200).send({
//     message: "User loggedin Successfully",
//     onboarding: getTrainer.isOnboardingDone,
//     token: token,
//   });
// };

// // Function to resend verification code
// exports.resendOtp = async (req, res) => {
//   const { phone } = req.body;
//   const user = await User.findOne({ phone: phone });
//   if (user) {
//     const otp = otpSend();
//     const newOtp = new OtpModal({ userId: user._id, otp: otp });
//     const savedOtp = await newOtp.save();
//     sendSMS(phone, `Your verification code is ${otp}`);
//     res.status(200).send({
//       message: "Verification code send successfully",
//     });
//   } else {
//     res.status(404).send("User not found");
//   }
// };

// // Function to send OTP (Forget password)
// exports.forgetPassword = async (req, res) => {
//   try {
//     const { email } = req.body;
//     const trainer = await User.findOne({ email: email });
//     if (trainer) {
//       await User.findByIdAndUpdate(
//         trainer._id,
//         { emailVerifiedAt: null },
//         { new: true }
//       );
//       const otp = otpSend();
//       const newOtp = new OtpModal({ userId: trainer._id, otp: otp });
//       const savedOtp = await newOtp.save();
//       sendEmailToAdmin(email, otp);
//       res.status(200).send({
//         message: "Verification code send successfully",
//       });
//     } else {
//       res.status(404).send("User not found");
//     }
//   } catch (err) {
//     console.log("<forgetPassword>", err);
//     res.status(500).send({ Error: err });
//   }
// };
