const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const subcategoryRoute = require("./routes/subcategoryRoute");
const reviewRoute = require("./routes/reviewRoute");
const dotenv = require("dotenv");
const app = express();
const PORT = process.env.PORT || 5000;

// config .env file
dotenv.config();

// Connect MongoDB
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// all routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/subcategory", subcategoryRoute);
app.use("/api/reviews", reviewRoute);


// Error handling middleware (optional)
// const { errorHandler } = require("./middlewares/errorMiddleware");
// app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
