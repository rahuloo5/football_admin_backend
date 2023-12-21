const jwt = require("jsonwebtoken");
require("dotenv").config();

function generateToken(payload) {
  const secretKey = process.env?.SECRET_KEY || "secure-living";
  const expiresIn = "1d";

  const token = jwt.sign(payload, secretKey, { expiresIn: "8h" });
  console.log("token taken", token);

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
      req.user = decoded.id;
      next();
    }
  );
}

module.exports = { generateToken, authMiddleware };
