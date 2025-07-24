const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    images: [
      {
        url: String,
        public_id: String,
      },
    ],
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    numOfReviews: {
      type: Number,
      default: 0,
      min: 0,
    },
    wholesalePrice: {
      type: Number,
      required: true,
    },
    profitPercentage: {
      type: Number,
      max: 100,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    subcategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subcategory",
      required: true,
    },
    stock: {
      type: Number,
      required: true,
    },
    tags: [String],
    brand: {
      type: String,
    },
    sku: {
      type: String,
      unique: true,
    },
    warrantyInfo: {
      type: String,
    },
    shippingInfo: {
      type: String,
    },
    status: {
      type: Boolean,
      default: true, // true means In Stock
    },
    returnPolicy: {
      type: String,
    },
    minOrderQty: {
      type: Number,
      default: 1,
    },
    manufacturingCountry: {
      type: String,
    },
    size: {
      type: String,
    },
    color: {
      type: String,
    },
    groupUnit: {
      type: String,
    },
    groupQuantity: {
      type: Number,
    },
    unit: {
      type: String,
    },
    productVariantType: {
      type: String,
      enum: ["Single Variant", "Multi-Variant", "Non-Variant"],
    },
    warehouseLocation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Warehouse",
    },
    wholeseler: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
