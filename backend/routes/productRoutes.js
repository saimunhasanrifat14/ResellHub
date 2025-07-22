const express = require("express");
const router = express.Router();
const upload = require("../middlewares/multer");
const verifyToken = require("../middlewares/verifyToken");
const checkRole = require("../middlewares/checkRole");
const { createProduct } = require("../controllers/productController");

router.post(
  "/upload-product",
  verifyToken,
  checkRole("wholesaler"),
  upload.array("images", 5), // up to 5 images
  createProduct
);

module.exports = router;
