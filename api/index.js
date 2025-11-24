// /api/index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected..."))
  .catch(err => console.log(err));

// Test Route
app.get('/api/health', (req, res) => {
  res.status(200).send("API is running!");
});

// Start server
app.listen(process.env.PORT || 5000, () => {
  console.log("API server running...");
});
