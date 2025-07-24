const Review = require("../models/reviewModel");
const Product = require("../models/productModel");

const updateProductRating = async (productId) => {
  const reviews = await Review.find({ product: productId });

  const numOfReviews = reviews.length;

  let averageRating = 0;
  if (numOfReviews > 0) {
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    averageRating = total / numOfReviews;
  }

  await Product.findByIdAndUpdate(productId, {
    averageRating,
    numOfReviews,
  });
};

module.exports = updateProductRating;
