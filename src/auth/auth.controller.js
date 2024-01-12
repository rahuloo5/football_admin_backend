const { otpSend } = require("../utility/common");

exports.userregister = async (req, res) => {
  try {
    const { phome_number } = req.body;
    console.log("user phone number", req.body);
    const isUserExist = await User.findOne({ phome_number });
    let savedUser;
    if (isUserExist) {
      const otp = otpSend();
      const newOtp = new OtpModal({
        userId: isUserExist?._id,
        otp,
      });
      const savedOtp = await newOtp.save();
      if (isUserExist.isOnboardingDone) {
        res.status(201).send({ message: "User already registered" });
        return;
      }
      res
        .status(200)
        .send("Verification code generated successfully, please check");
      return;
    } else {
      const newUser = new User(req.body);
      savedUser = await newUser.save();
    }

    const otp = otpSend();
    const newOtp = new OtpModal({
      userId: savedUser?._id || isUserExist?._id,
      otp,
    });
    const savedOtp = await newOtp.save();
    res
      .status(200)
      .send("Verification code generated successfully, please check");
  } catch (err) {
    if (err.code === 11000) {
      const errorData = JSON.stringify(err.keyPattern);
      res.status(400).send({ err: `${errorData} should be unique` });
    } else {
      res.status(500).json({ error: err });
    }
  }
};
