const jwt = require("jsonwebtoken");
require("dotenv").config();

function GeneratesSignature(payload) {
  const secretKey = process.env?.SECRET_KEY || "secure-living";
  const expiresIn = "50d";

  const token = jwt.sign(payload, secretKey, { expiresIn });

  return token;
}

function authMiddleware(req, res, next) {
  const token = (req.header("Authorization") || "").replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  jwt.verify(
    token,
    process.env.SECRET_KEY || "secure-living",
    (err, decoded) => {
      if (err) {
        return res
          .status(403)
          .json({ message: "Failed to authenticate token" });
      }
      // Set req.user as an object with id property
      req.user = { id: decoded._id || decoded.id };
      next();
    }
  );
}

module.exports = { GeneratesSignature, authMiddleware };
