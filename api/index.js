const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000", // React dev server
    credentials: true,
  })
);

// Ensure uploads folder exists
const avatarsDir = path.join(__dirname, "uploads/avatars");
if (!fs.existsSync(avatarsDir)) {
  fs.mkdirSync(avatarsDir, { recursive: true });
}

// Serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("Mongo Error:", err));

// Routes
const userRoutes = require("./routes/userRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const storyRoutes = require("./routes/storyRoutes");
const testRoutes = require("./routes/testRoutes");
const blogRoutes = require("./routes/blogRoutes");
const followerRoutes = require("./routes/followerRoutes");
const sceneRoutes = require("./routes/sceneRoutes");

// Mount routes
app.use("/api/users", userRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/stories", storyRoutes);
app.use("/api/test", testRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/followers", followerRoutes);
app.use("/api/scenes", sceneRoutes);
app.use("/api/explorer", require("./routes/explorerRoutes"));

// Default test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
