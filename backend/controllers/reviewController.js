const Review = require("../models/reviewModel");
const Product = require("../models/productModel");
const updateProductRating = require("../utils/updateProductRating");

exports.createReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const { productId } = req.params;
    const userId = req.user.id;

    if (!rating || !comment) {
      return res
        .status(400)
        .json({ message: "Rating and comment are required" });
    }

    // Check for existing review
    const existingReview = await Review.findOne({
      product: productId,
      user: userId,
    });
    if (existingReview) {
      return res
        .status(400)
        .json({ message: "You already reviewed this product" });
    }

    // Create and save review
    const review = new Review({
      product: productId,
      user: userId,
      rating,
      comment,
    });
    await review.save();

    // 👉 Push review _id into the product's reviews array
    await Product.findByIdAndUpdate(productId, {
      $push: { reviews: review._id },
    });

    await updateProductRating(review.product);

    res.status(201).json({ message: "Review added", review });
  } catch (error) {
    res.status(500).json({ message: "Failed to add review", error });
  }
};

exports.getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await Review.find({ product: productId }).populate(
      "user",
      "name"
    );

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch reviews", error });
  }
};

exports.updateReview = async (req, res) => {
  const { reviewId } = req.params;
  const { rating, comment } = req.body;

  try {
    const review = await Review.findById(reviewId);

    if (!rating && !comment) {
      return res.status(400).json({ message: "Nothing to update" });
    }

    if (!review) return res.status(404).json({ message: "Review not found" });

    if (review.user.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You are not allowed to update this review" });
    }

    if (rating) review.rating = rating;
    if (comment) review.comment = comment;

    await review.save();

    await updateProductRating(review.product);

    res.status(200).json({ message: "Review updated", review });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: err.message });
  }
};

exports.deleteReview = async (req, res) => {
  const { reviewId } = req.params;

  try {
    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (review.user.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You are not allowed to delete this review" });
    }

    // Remove the review ID from the product's reviews array
    await Product.findByIdAndUpdate(review.product, {
      $pull: { reviews: review._id },
    });

    // Delete the review
    await Review.findByIdAndDelete(reviewId);

    await updateProductRating(review.product);

    res.status(200).json({ message: "Review deleted" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: err.message });
  }
};
