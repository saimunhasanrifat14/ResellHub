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
      wholeseler: req.user.id,
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

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Find the product
    const product = await Product.findById(id);

    if (!product) return res.status(404).json({ message: "Product not found" });

    // 2. Check if user is the wholeseler of the product
    if (product.wholeseler.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this product" });
    }

    // 3. Update all fields from req.body
    const updatableFields = [
      "name",
      "description",
      "wholesalePrice",
      "profitPercentage",
      "category",
      "subcategory",
      "stock",
      "tags",
      "brand",
      "sku",
      "warrantyInfo",
      "shippingInfo",
      "status",
      "returnPolicy",
      "minOrderQty",
      "manufacturingCountry",
      "size",
      "color",
      "groupUnit",
      "groupQuantity",
      "unit",
      "productVariantType",
      "warehouseLocation",
    ];

    updatableFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        product[field] = req.body[field];
      }
    });

    // 4. If new images uploaded
    if (req.files && req.files.length > 0) {
      // Delete old images from Cloudinary
      for (const img of product.images) {
        await cloudinary.uploader.destroy(img.public_id);
      }

      // Upload new images to Cloudinary
      const uploadedImages = [];

      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path);
        uploadedImages.push({
          url: result.secure_url,
          public_id: result.public_id,
        });
      }

      // Replace images
      product.images = uploadedImages;
    }

    // 5. Save updated product
    const updated = await product.save();
    res.status(200).json(updated);
  } catch (err) {
    console.error("Update error:", err);
    res
      .status(500)
      .json({ message: "Something went wrong", error: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check ownership
    if (product.wholeseler.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this product" });
    }

    // Delete product images from Cloudinary
    for (let img of product.images) {
      if (img.public_id) {
        await cloudinary.uploader.destroy(img.public_id);
      }
    }

    // Delete product from DB
    await product.deleteOne();

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
