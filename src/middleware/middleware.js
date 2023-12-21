const { verifyToken } = require("../utility/password_hash");

const Authenticateuser = async (req, res, next) => {
  const validate = await verifyToken(req);

  if (validate) {
    return next();
  } else {
    return res.json({
      Message: "User are not authenticate",
    });
  }
};

module.exports = {
  Authenticateuser,
};
