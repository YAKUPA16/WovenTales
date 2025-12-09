// [Backend] api/controllers/storyController.js
const mongoose = require("mongoose");
const Story = require("../models/Story");
const Comment = require("../models/Comment");
const Scene = require("../models/Scene");

// helpers
function isObjId(id) {
  return mongoose.isValidObjectId(id);
}

function toNumber(n) {
  const x = Number(n);
  return Number.isFinite(x) ? x : 0;
}

function calcAvgRating(ratings) {
  if (!Array.isArray(ratings) || ratings.length === 0) return 0;

  // supports:
  // 1) [{ user, value }]
  // 2) [number, number]
  const values = ratings
    .map((r) => (typeof r === "number" ? r : r?.value))
    .map(toNumber)
    .filter((v) => v > 0);

  if (!values.length) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

/**
 * GET /api/stories/:id/details
 * (your StoryModal calls GET /stories/:id)
 */
exports.getStoryDetails = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isObjId(id)) return res.status(400).json({ message: "Invalid story id" });

    const story = await Story.findById(id)
      .populate("author", "username name")
      .lean();

    if (!story) return res.status(404).json({ message: "Story not found" });

    const comments = await Comment.find({ story: id })
      .sort({ createdAt: -1 })
      .limit(50)
      .populate("user", "username name")
      .lean();

    const likesCount = Array.isArray(story.likes) ? story.likes.length : 0;
    const ratingsCount = Array.isArray(story.ratings) ? story.ratings.length : 0;
    const avgRating = calcAvgRating(story.ratings);

    const viewerId = req.user?._id;
    const likedByMe =
      !!viewerId &&
      Array.isArray(story.likes) &&
      story.likes.some((x) => String(x) === String(viewerId));

    let myRating = 0;
    if (viewerId && Array.isArray(story.ratings)) {
      const mine = story.ratings.find(
        (r) => r && String(r.user) === String(viewerId)
      );
      myRating = mine?.value ? Number(mine.value) : 0;
    }

    return res.json({
      story: {
        ...story,
        likesCount,
        ratingsCount,
        avgRating,
        likedByMe,
        myRating,
      },
      comments,
    });
  } catch (e) {
    return res
      .status(500)
      .json({ message: "Failed to load story", error: e.message });
  }
};

/**
 * POST /api/stories/:id/comments
 */
exports.addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    if (!isObjId(id)) return res.status(400).json({ message: "Invalid story id" });
    if (!text || !text.trim())
      return res
        .status(400)
        .json({ message: "Comment text is required" });

    const story = await Story.findById(id).select("_id");
    if (!story) return res.status(404).json({ message: "Story not found" });

    const comment = await Comment.create({
      story: id,
      user: req.user._id,
      text: text.trim(),
    });

    await Story.updateOne({ _id: id }, { $inc: { commentsCount: 1 } });

    const populated = await Comment.findById(comment._id)
      .populate("user", "username name")
      .lean();

    return res.status(201).json({ comment: populated });
  } catch (e) {
    return res
      .status(500)
      .json({ message: "Failed to add comment", error: e.message });
  }
};

/**
 * POST /api/stories/:id/like  (toggle)
 */
exports.toggleLike = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isObjId(id)) return res.status(400).json({ message: "Invalid story id" });

    const userId = req.user._id;

    const story = await Story.findById(id).select("likes");
    if (!story) return res.status(404).json({ message: "Story not found" });

    const alreadyLiked =
      Array.isArray(story.likes) &&
      story.likes.some((x) => String(x) === String(userId));

    await Story.updateOne(
      { _id: id },
      alreadyLiked
        ? { $pull: { likes: userId } }
        : { $addToSet: { likes: userId } }
    );

    const updated = await Story.findById(id).select("likes").lean();
    return res.json({
      likesCount: updated.likes?.length || 0,
      liked: !alreadyLiked,
    });
  } catch (e) {
    return res
      .status(500)
      .json({ message: "Failed to like story", error: e.message });
  }
};

/**
 * POST /api/stories/:id/rate
 * body: { value: 1..5 }
 */
exports.rateStory = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isObjId(id)) return res.status(400).json({ message: "Invalid story id" });

    const value = Number(req.body.value);
    if (![1, 2, 3, 4, 5].includes(value)) {
      return res.status(400).json({ message: "Rating must be 1..5" });
    }

    const userId = req.user._id;

    // Try updating existing rating first
    const updateRes = await Story.updateOne(
      { _id: id, "ratings.user": userId },
      { $set: { "ratings.$.value": value } }
    );

    // If no existing rating was updated, add new one
    if (!updateRes.modifiedCount) {
      await Story.updateOne(
        { _id: id },
        { $addToSet: { ratings: { user: userId, value } } }
      );
    }

    const updated = await Story.findById(id).select("ratings").lean();
    const avgRating = calcAvgRating(updated.ratings);
    const ratingsCount = Array.isArray(updated.ratings)
      ? updated.ratings.length
      : 0;

    return res.json({ avgRating, ratingsCount });
  } catch (e) {
    return res
      .status(500)
      .json({ message: "Failed to rate story", error: e.message });
  }
};

/**
 * GET /api/stories/:id/scenes
 * Used by ReaderPage: axiosInstance.get(`/stories/${storyId}/scenes`)
 *
 * ReaderPage expects:
 * {
 *   title,
 *   rootSceneId,
 *   scenes: [
 *     {
 *       _id,
 *       text,
 *       hasEnded,
 *       choices: [{ _id, text, targetSceneId }]
 *     }
 *   ]
 * }
 */
exports.getStoryScenes = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isObjId(id)) {
      return res.status(400).json({ message: "Invalid story id" });
    }

    const story = await Story.findById(id).select("title firstScene");
    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }

    const scenesRaw = await Scene.find({ storyId: id }).lean();

    const scenes = scenesRaw.map((s) => ({
      _id: s._id.toString(),
      text: s.content, // ReaderPage uses currentScene.text
      hasEnded: s.hasEnded,
      choices: (s.choices || []).map((c) => ({
        _id: c._id?.toString(),
        text: c.text,
        targetSceneId: c.nextScene ? c.nextScene.toString() : null, // ReaderPage uses targetSceneId
      })),
    }));

    return res.json({
      title: story.title,
      rootSceneId: story.firstScene ? story.firstScene.toString() : null,
      scenes,
    });
  } catch (e) {
    console.error("getStoryScenes error:", e);
    return res
      .status(500)
      .json({ message: "Failed to load story scenes", error: e.message });
  }
};

exports.createStory = async (req, res) => {
  try {
    const { title, content, isEnding } = req.body;
    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required" });
    }

    // Create story
    const story = await Story.create({
      title,
      author: req.user._id
    });

    // Create first scene
    const firstScene = await Scene.create({
      storyId: story._id,
      content,
      author: req.user._id,
      hasEnded: !!isEnding
    });

    // Link story.firstScene
    story.firstScene = firstScene._id;
    await story.save();

    res.status(201).json(story);
  } catch (err) {
    console.error("createStory error:", err);
    res.status(500).json({ message: "Failed to create story", error: err.message });
  }
};

exports.getAllStories = async (req, res) => {
  try {
    const stories = await Story.find({})
      .sort({ createdAt: -1 }) // newest first
      .populate("author", "username name")
      .lean();

    const result = stories.map((story) => ({
      _id: story._id,
      title: story.title,
      author: story.author,
      coverImage: story.coverImage || null,
      description: story.description || "",
      likesCount: Array.isArray(story.likes) ? story.likes.length : 0,
      ratingsCount: Array.isArray(story.ratings) ? story.ratings.length : 0,
      avgRating: calcAvgRating(story.ratings),
      createdAt: story.createdAt,
    }));

    return res.json({ stories: result });
  } catch (e) {
    return res
      .status(500)
      .json({ message: "Failed to load stories", error: e.message });
  }
};