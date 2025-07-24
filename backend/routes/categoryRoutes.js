// routes/categoryRoutes.js
const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken");
const checkRole = require("../middlewares/checkRole");
const {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");

router.post("/create", verifyToken, checkRole("wholesaler"), createCategory);
router.get("/all", getCategories);
router.put("/update/:id", verifyToken, checkRole("wholesaler"), updateCategory);
router.delete("/delete/:id", verifyToken, checkRole("wholesaler"), deleteCategory);

module.exports = router;
