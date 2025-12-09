// [Backend] api/routes/storyRoutes.js
const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const {
  getStoryDetails,
  addComment,
  toggleLike,
  rateStory,
} = require("../controllers/storyController");

router.get("/:id", protect, getStoryDetails);
router.post("/:id/comments", protect, addComment);
router.post("/:id/like", protect, toggleLike);
router.post("/:id/rate", protect, rateStory);

module.exports = router;
