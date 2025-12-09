// [Backend] api/routes/storyRoutes.js
const express = require("express");
const router = express.Router();

const Scene = require("../models/Scene");
const Story = require("../models/Story");
const { protect } = require("../middleware/authMiddleware");
const storyController = require("../controllers/storyController");

const {
  createStory,
  getStoryDetails,
  addComment,
  toggleLike,
  rateStory,
} = require("../controllers/storyController");


router.get("/:id/scenes", protect, async (req, res) => {
  try {
    const storyId = req.params.id;

    // find the story
    const story = await Story.findById(storyId).select("title firstScene");
    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }

    // IMPORTANT: populate author (username + name)
    const scenes = await Scene.find({ storyId })
      .populate("author", "username name")
      .lean();

    return res.json({
      title: story.title,
      rootSceneId: story.firstScene ? story.firstScene.toString() : null,
      scenes,
    });
  } catch (err) {
    console.error("GET /stories/:id/scenes error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get('/my-contributions/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find all scene storyIds authored by this user
    const scenes = await Scene.find({ author: userId }).select('storyId');
    const storyIds = [...new Set(scenes.map(scene => scene.storyId.toString()))]; // unique story IDs

    // Fetch all stories with those IDs
    const stories = await Story.find({ _id: { $in: storyIds } });

    res.json(stories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// other story routes
router.get("/:id", protect, getStoryDetails);
router.post("/:id/comments", protect, addComment);
router.post("/:id/like", protect, toggleLike);
router.post("/:id/rate", protect, rateStory);
router.post("/", protect, createStory);
router.get("/", storyController.getAllStories);

module.exports = router;
