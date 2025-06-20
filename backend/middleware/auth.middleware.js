// middleware/protectRoute.js
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const auth = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded._id) {
      return res.status(401).json({ message: "Unauthorized - Invalid Token" });
    }

    const user = await User.findById(decoded._id).select("-passwordHash");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    req.user = user;
    next();
  } catch (error) {
    console.error("Error in protectRoute middleware:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user && req.user.roles && req.user.roles.includes('admin')) {
    return next();
  }
  return res.status(403).json({ message: "Forbidden - Admins only" });
};

module.exports = {
  auth,
  isAdmin,
};
