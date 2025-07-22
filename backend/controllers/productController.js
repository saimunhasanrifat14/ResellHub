const Product = require("../models/productModel");
const cloudinary = require("../utils/cloudinary");

exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      rating,
      wholesalePrice,
      sellingPrice,
      profitPercentage,
      category,
      subcategory,
      stock,
      tags,
      brand,
      sku,
      warrantyInfo,
      shippingInfo,
      status,
      returnPolicy,
      minOrderQty,
      manufacturingCountry,
      size,
      color,
      groupUnit,
      groupQuantity,
      unit,
      productVariantType,
      warehouseLocation,
    } = req.body;

    // Check if images are uploaded
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "Please upload product images" });
    }

    // Upload images to Cloudinary
    const uploadedImages = await Promise.all(
      req.files.map(async (file) => {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "resellhub_products",
        });

        return {
          url: result.secure_url,
          public_id: result.public_id,
        };
      })
    );

    const product = new Product({
      name,
      description,
      rating: rating || 0,
      wholesalePrice,
      sellingPrice,
      profitPercentage,
      category,
      subcategory,
      stock,
      tags: tags ? tags.split(",") : [],
      brand,
      sku,
      warrantyInfo,
      shippingInfo,
      status,
      returnPolicy,
      minOrderQty,
      manufacturingCountry,
      size,
      color,
      groupUnit,
      groupQuantity,
      unit,
      productVariantType,
      warehouseLocation,
      images: uploadedImages,
      wholeseller: req.user.id,
    });

    await product.save();

    res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error("Create Product Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
