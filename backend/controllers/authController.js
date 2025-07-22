const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cloudinary = require("../utils/cloudinary");

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// @route   POST /api/auth/register
exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    // search on database is user already exists
    const userExists = await User.findOne({ email });
    // if user exist it will return a response with status code 400 and error message
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    // convert password to hashed password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // save on database
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    // after new user saved send a response with status code 201 and new user data
    res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      token: generateToken(newUser._id),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route   POST /api/auth/login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // search on database is user already exists
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // check user password match or not
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    // if user successfully login then give him a token for 7 days
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      shopName,
      location,
      wholesalerLocation,
      companyName,
      licenseNo,
      tradeLink,
    } = req.body;

    // 1. Find user
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // 2. Basic updates
    if (name) user.name = name;
    if (email) user.email = email;

    // 3. Update password (if provided)
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    // 4. Profile Image Upload (Cloudinary + Multer)
    if (req.file) {
      // Delete old image if exists
      if (user.avatar?.public_id) {
        await cloudinary.uploader.destroy(user.avatar.public_id);
      }

      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "user-profiles",
      });

      user.avatar = {
        public_id: result.public_id,
        url: result.secure_url,
      };
    }

    // 5. Role-based extra fields
    if (user.role === "reseller") {
      if (shopName) user.shopName = shopName;
      if (location) user.location = location;
    }

    if (user.role === "wholesaler") {
      if (wholesalerLocation) user.wholesalerLocation = wholesalerLocation;
      if (companyName) user.companyName = companyName;
      if (licenseNo) user.licenseNo = licenseNo;
      if (tradeLink) user.tradeLink = tradeLink;
    }

    // 6. Save updates
    const updatedUser = await user.save();

    // 7. Send response
    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        avatar: updatedUser.avatar,
        shopName: updatedUser.shopName,
        location: updatedUser.location,
        companyName: updatedUser.companyName,
        wholesalerLocation: updatedUser.wholesalerLocation,
        licenseNo: updatedUser.licenseNo,
        tradeLink: updatedUser.tradeLink,
      },
    });
  } catch (error) {
    console.error("Update error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
