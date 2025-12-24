const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();
const { connectToMongo } = require("./db");
const authRoutes = require("./routes/auth");
const todoRoutes = require("./routes/todos");


const app = express();
app.use(bodyParser.json());

connectToMongo();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/todos", todoRoutes);


app.listen(5000, () => console.log("Server running on port 5000"));
