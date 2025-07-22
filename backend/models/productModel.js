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
    rating: {
      type: Number,
      default: 0,
      max: 5,
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
      type:String,
    },
    subcategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategory",
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
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
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
    wholeseller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
