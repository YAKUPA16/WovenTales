const express = require("express");
const router = express.Router();
const Follower = require("../models/Follower");
const { protect } = require("../middleware/authMiddleware");

// Follow user
router.post("/follow/:id", protect, async (req, res) => {
  try {
    const already = await Follower.findOne({
      user: req.user._id,
      following: req.params.id,
    });

    if (already) return res.status(400).json({ message: "Already following" });

    await Follower.create({
      user: req.user._id,
      following: req.params.id,
    });

    res.json({ message: "User followed successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Unfollow user
router.delete("/unfollow/:id", protect, async (req, res) => {
  try {
    const found = await Follower.findOneAndDelete({
      user: req.user._id,
      following: req.params.id,
    });

    if (!found)
      return res.status(400).json({ message: "Not following this user" });

    res.json({ message: "User unfollowed successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all users that current user is following
router.get("/following", protect, async (req, res) => {
  try {
    const following = await Follower.find({ user: req.user._id })
      .populate("following", "username"); // only populate username
    res.json(following);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
