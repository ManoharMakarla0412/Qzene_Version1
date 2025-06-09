// config/utils.config.js
const jwt = require("jsonwebtoken");

const generateToken = (user, res) => {
  const token = jwt.sign(
    { _id: user._id, roles: user.roles },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  });
  return token;
};

module.exports = { generateToken };
