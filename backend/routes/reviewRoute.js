const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken");
const checkRole = require("../middlewares/checkRole");
const {
  createReview,
  getProductReviews,
  updateReview,
  deleteReview,
} = require("../controllers/reviewController");

router.post("/create/:productId", verifyToken, createReview);
router.get("/getall/:productId", getProductReviews);
router.put(
  "/update/:reviewId",
  verifyToken,
  checkRole("reseller"),
  updateReview
);
router.delete(
  "/delete/:reviewId",
  verifyToken,
  checkRole("reseller"),
  deleteReview
);

module.exports = router;
