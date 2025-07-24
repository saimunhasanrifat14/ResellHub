const express = require("express");
const router = express.Router();
const upload = require("../middlewares/multer");
const verifyToken = require("../middlewares/verifyToken");
const checkRole = require("../middlewares/checkRole");
const {
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getSingleProduct,
  getProductsByCategory,
  getProductsBySubcategory,
} = require("../controllers/productController");

router.post(
  "/upload-product",
  verifyToken,
  checkRole("wholesaler"),
  upload.array("images", 5), // up to 5 images
  createProduct
);
router.put(
  "/update-product/:id",
  verifyToken,
  checkRole("wholesaler"),
  upload.array("images", 5), // up to 5 images
  updateProduct
);
router.delete(
  "/delete/:id",
  verifyToken,
  checkRole("wholesaler"),
  deleteProduct
);
router.get("/all", getAllProducts);
router.get("/single-product/:id", getSingleProduct);
router.get("/by-category/:categoryId", getProductsByCategory);
router.get("/by-subcategory/:subcategoryId", getProductsBySubcategory);

module.exports = router;
