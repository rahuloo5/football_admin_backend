exports.generateHashedPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

exports.otpSend = () => {
  const min = 10 ** (4 - 1);
  const max = 10 ** 4 - 1;

  return Math.floor(Math.random() * (max - min + 1)) + min;
};

console.log(this.otpSend());
