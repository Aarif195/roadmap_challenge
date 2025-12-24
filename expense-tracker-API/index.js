const express = require("express");
const { connectToMongo } = require("./db");
const authRoutes = require("./routes/auth");
const expenseRoutes = require("./routes/expenses");

require("dotenv").config();
const app = express();
app.use(express.json());

// Connect to MongoDB
connectToMongo().catch(err => console.error("MongoDB connection error:", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
