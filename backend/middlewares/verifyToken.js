const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token)
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Fetch full user from DB to get role and other info
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found." });

    req.user = user; // now req.user.role will exist ✅
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid token." });
  }
};

module.exports = verifyToken;
