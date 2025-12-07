// [Backend] api/controllers/storyController.js
const mongoose = require("mongoose");
const Story = require("../models/Story");
const Comment = require("../models/Comment");

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

// GET /api/stories/:id/details  (Modal loads this)
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

    // helpful flags for UI (global counts + whether THIS user liked/rated)
    const viewerId = req.user?._id;
    const likedByMe =
      !!viewerId && Array.isArray(story.likes) && story.likes.some((x) => String(x) === String(viewerId));

    let myRating = 0;
    if (viewerId && Array.isArray(story.ratings)) {
      const mine = story.ratings.find((r) => r && String(r.user) === String(viewerId));
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
    return res.status(500).json({ message: "Failed to load story", error: e.message });
  }
};

// POST /api/stories/:id/comments
exports.addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    if (!isObjId(id)) return res.status(400).json({ message: "Invalid story id" });
    if (!text || !text.trim()) return res.status(400).json({ message: "Comment text is required" });

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
    return res.status(500).json({ message: "Failed to add comment", error: e.message });
  }
};

// POST /api/stories/:id/like  (toggle)
exports.toggleLike = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isObjId(id)) return res.status(400).json({ message: "Invalid story id" });

    const userId = req.user._id;

    const story = await Story.findById(id).select("likes");
    if (!story) return res.status(404).json({ message: "Story not found" });

    const alreadyLiked = Array.isArray(story.likes) && story.likes.some((x) => String(x) === String(userId));

    await Story.updateOne(
      { _id: id },
      alreadyLiked ? { $pull: { likes: userId } } : { $addToSet: { likes: userId } }
    );

    const updated = await Story.findById(id).select("likes").lean();
    return res.json({
      likesCount: updated.likes?.length || 0,
      liked: !alreadyLiked,
    });
  } catch (e) {
    return res.status(500).json({ message: "Failed to like story", error: e.message });
  }
};

// POST /api/stories/:id/rate
// expects { value: 1..5 }
exports.rateStory = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isObjId(id)) return res.status(400).json({ message: "Invalid story id" });

    const value = Number(req.body.value);
    if (![1, 2, 3, 4, 5].includes(value)) {
      return res.status(400).json({ message: "Rating must be 1..5" });
    }

    const userId = req.user._id;

    // Try update existing rating first
    const updateRes = await Story.updateOne(
      { _id: id, "ratings.user": userId },
      { $set: { "ratings.$.value": value } }
    );

    // If no existing rating was updated, add new one
    if (!updateRes.modifiedCount) {
      await Story.updateOne(
        { _id: id },
        { $addToSet: { ratings: { user: userId, value } } } // addToSet prevents duplicates if same object exists
      );
    }

    const updated = await Story.findById(id).select("ratings").lean();
    const avgRating = calcAvgRating(updated.ratings);
    const ratingsCount = Array.isArray(updated.ratings) ? updated.ratings.length : 0;

    return res.json({ avgRating, ratingsCount });
  } catch (e) {
    return res.status(500).json({ message: "Failed to rate story", error: e.message });
  }
};
