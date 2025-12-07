const User = require("../models/User");
const jwt = require("jsonwebtoken");
const path = require("path");

// Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

// Signup
const signupUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    const user = await User.create({ username, email, password });

    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error during signup" });
  }
};

// Login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error during login" });
  }
};

// Get Profile
const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json(user);
};

// Update Avatar
const updateUserAvatar = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const filePath = `/uploads/avatars/${req.file.filename}`;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { profileImage: filePath },
      { new: true }
    ).select("-password");

    res.json(updatedUser);
  } catch (err) {
    console.error("Avatar update error:", err);
    res.status(500).json({ message: "Server error updating avatar" });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const { username, email, description, bgColor } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { username, email, description, bgColor },
      { new: true }
    ).select('-password');

    res.json(updatedUser);
  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({ message: "Server error updating profile" });
  }
};

module.exports = {
  signupUser,
  loginUser,
  getUserProfile,
  updateUserAvatar,
  updateUserProfile,
};