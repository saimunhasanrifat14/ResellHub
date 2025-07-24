const Subcategory = require("../models/subcategoryModel");
const slugify = require("slugify");

exports.createSubcategory = async (req, res) => {
  try {
    const { name, category } = req.body;
    const slug = slugify(name);

    const subcategory = await Subcategory.create({ name, slug, category });
    res.status(201).json(subcategory);
  } catch (error) {
    res.status(500).json({ message: "Subcategory creation failed", error });
  }
};

exports.getAllSubcategories = async (req, res) => {
  try {
    const subcategories = await Subcategory.find().populate("category", "name");
    res.json(subcategories);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch subcategories", error });
  }
};
