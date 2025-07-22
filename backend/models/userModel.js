const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"],
    },
    email: {
      type: String,
      required: [true, "Please enter your email"],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Please enter your password"],
    },
    avatar: {
      public_id: String,
      url: String,
    },
    role: {
      type: String,
      enum: ["reseller", "wholesaler", "admin"],
      default: "reseller",
      required: true,
    },

    // Reseller (optional at registration)
    shopName: {
      type: String,
    },
    location: {
      type: String,
    },

    // Wholesaler (optional at registration)
    wholesalerLocation: {
      type: String,
    },
    companyName: {
      type: String,
    },
    licenseNo: {
      type: String,
    },
    tradeLink: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
