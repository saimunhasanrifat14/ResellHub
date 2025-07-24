const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken");
const checkRole = require("../middlewares/checkRole");
const {
  createSubcategory,
  getAllSubcategories,
} = require("../controllers/subcategoryController");

// Create subcategory (only admin allowed)
router.post("/create", verifyToken, checkRole("wholesaler"), createSubcategory);

// Get all subcategories
router.get("/all", getAllSubcategories);

module.exports = router;
