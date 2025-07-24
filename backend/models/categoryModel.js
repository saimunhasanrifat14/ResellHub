const mongoose = require("mongoose");
const slugify = require("slugify");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
  },
  { timestamps: true }
);

// Generate slug before saving
categorySchema.pre("save", function (next) {
  this.slug = slugify(this.name);
  next();
});

const Category = mongoose.model("Category", categorySchema);
module.exports = Category;
