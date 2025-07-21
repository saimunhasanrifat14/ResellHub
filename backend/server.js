const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Connect MongoDB
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes (we’ll add these later)
app.get("/", (req, res) => {
  res.send("ResellHub API is running 🚀");
});

// Error handling middleware (optional)
// const { errorHandler } = require("./middlewares/errorMiddleware");
// app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
