const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("Mongo Error:", err));

// Routes
try {
  const userRoutes = require("./routes/userRoutes");
  //const storyRoutes = require("./routes/storyRoutes");
  //const blogRoutes = require("./routes/blogRoutes");

  // ✅ Mount routes
  app.use("/api/users", userRoutes);
  //app.use("/api/stories", storyRoutes);
  //app.use("/api/blogs", blogRoutes);

  // Commented out temporarily until engagementRoutes exists
  // const engagementRoutes = require("./routes/engagementRoutes");
  // app.use("/api/engagement", engagementRoutes);
} catch (err) {
  console.error("Error loading routes:", err);
}

// Default test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
