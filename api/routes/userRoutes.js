const express = require("express");
const multer = require("multer");
const {
  signupUser,
  loginUser,
  getUserProfile,
  updateUserAvatar,
  updateUserProfile,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const fs = require("fs");
const path = require("path");

const router = express.Router();

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, "../uploads/avatars");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = file.originalname.split(".").pop();
    cb(null, `${req.user._id}.${ext}`);
  },
});
const upload = multer({ storage });

// Public routes
router.post("/signup", signupUser);
router.post("/login", loginUser);

// Protected routes
router.get("/profile", protect, getUserProfile);
router.put("/avatar", protect, upload.single("avatar"), updateUserAvatar);
router.put("/update", protect, updateUserProfile);

module.exports = router;
