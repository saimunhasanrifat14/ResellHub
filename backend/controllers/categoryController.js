const Category = require("../models/categoryModel");

// 👉 Create category
exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: "Name is required" });

    const existing = await Category.findOne({ name });
    if (existing) return res.status(409).json({ message: "Category already exists" });

    const category = await Category.create({ name });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// 👉 Get all categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// update category 
exports.updateCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      {
        name,
        slug: name ? name.toLowerCase().replace(/ /g, "-") : undefined,
      },
      { new: true }
    );

    res.json(updatedCategory);
  } catch (error) {
    res.status(500).json({ message: "Failed to update category", error });
  }
};

// 👉 Delete category
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await Category.findByIdAndDelete(id);
    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
