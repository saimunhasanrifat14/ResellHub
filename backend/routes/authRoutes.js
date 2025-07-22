const express = require("express");
const router = express.Router();
const {
  register,
  login,
  updateProfile,
} = require("../controllers/authController");
const verifyToken = require("../middlewares/verifyToken");
const upload = require("../middlewares/multer");
const User = require("../models/userModel");

router.post("/register", register);
router.post("/login", login);

// Update profile with optional image upload
router.put(
  "/update-profile",
  verifyToken,
  upload.single("profile"),
  updateProfile
);

// Protected user info route
router.get("/me", verifyToken, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json(user);
});

module.exports = router;
