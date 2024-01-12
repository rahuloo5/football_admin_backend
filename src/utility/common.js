exports.otpSend = () => {
  const min = 10 ** (4 - 1); // Minimum value (inclusive)
  const max = 10 ** 4 - 1; // Maximum value (inclusive)

  return Math.floor(Math.random() * (max - min + 1)) + min;
};
